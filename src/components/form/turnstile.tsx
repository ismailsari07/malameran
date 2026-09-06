"use client";

import Script from "next/script";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { REQUEST_FORM } from "@/content/request-form";

/**
 * Cloudflare Turnstile, invisible mode.
 *
 * The token is fetched at submit rather than at page load, so its short
 * lifetime never elapses while the form is being filled.
 *
 * Lifecycle, learned the hard way:
 *
 * - `execute()` must never be called while a previous call is in flight, or
 *   Cloudflare warns "already executing" and the second call is dropped. A
 *   single in-flight guard makes a second request return the first one's
 *   promise instead of starting another.
 * - The widget must be `remove()`d on unmount. The success screen swaps this
 *   component out; without removal Cloudflare later warns "Cannot find Widget"
 *   and leaks the container.
 * - A widget that never calls back must not hang the submission, so every
 *   request has a timeout.
 */

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      size?: "invisible" | "normal" | "flexible";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback"?: () => void;
    },
  ) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** A challenge that never resolves must not hold the submission open. */
const EXECUTE_TIMEOUT_MS = 20_000;

export type TurnstileHandle = {
  /** Resolves with a fresh token, or null if the widget could not produce one. */
  getToken: () => Promise<string | null>;
};

export function Turnstile({
  siteKey,
  ref,
}: {
  siteKey: string;
  ref?: React.Ref<TurnstileHandle>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const settleRef = useRef<((token: string | null) => void) | null>(null);
  const inFlightRef = useRef<Promise<string | null> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  /** Ends the current request exactly once, whatever caused it to end. */
  const settle = useCallback((token: string | null) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const resolve = settleRef.current;
    settleRef.current = null;
    inFlightRef.current = null;
    resolve?.(token);
  }, []);

  const mount = useCallback(() => {
    if (widgetIdRef.current !== null) return;
    const api = window.turnstile;
    const container = containerRef.current;
    if (!api || !container) return;

    widgetIdRef.current = api.render(container, {
      sitekey: siteKey,
      size: "invisible",
      callback: (token) => settle(token),
      "error-callback": () => settle(null),
      "expired-callback": () => settle(null),
      "timeout-callback": () => settle(null),
    });
    setReady(true);
  }, [siteKey, settle]);

  // Remove the widget on unmount. The success screen unmounts this component.
  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;
      if (widgetId !== null) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // Already gone; nothing to clean up.
        }
      }
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      getToken: () => {
        // Never start a second challenge while one is running: Cloudflare drops
        // it and warns. The retry path hits this.
        if (inFlightRef.current) return inFlightRef.current;

        const api = window.turnstile;
        const widgetId = widgetIdRef.current;
        if (!api || widgetId === null) return Promise.resolve(null);

        const promise = new Promise<string | null>((resolve) => {
          settleRef.current = resolve;
          timeoutRef.current = setTimeout(
            () => settle(null),
            EXECUTE_TIMEOUT_MS,
          );
          // A widget that has already produced a token will not produce another
          // until it is reset.
          try {
            api.reset(widgetId);
            api.execute(widgetId);
          } catch {
            settle(null);
          }
        });
        inFlightRef.current = promise;
        return promise;
      },
    }),
    [settle],
  );

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={mount}
      />
      <div
        className="rounded-12 border-border-reserved mt-3.5 flex min-h-[78px] items-center justify-center border border-dashed px-4 text-center"
        aria-hidden={!ready}
      >
        <div ref={containerRef} />
        {ready ? null : (
          <p className="t-hint text-disabled">
            {REQUEST_FORM.contact.challengeSlot}
          </p>
        )}
      </div>
    </>
  );
}
