"use client";

import Script from "next/script";
import { useCallback, useImperativeHandle, useRef, useState } from "react";

import { REQUEST_FORM } from "@/content/request-form";

/**
 * Cloudflare Turnstile, invisible mode.
 *
 * The token is fetched at submit rather than at page load, so its short
 * lifetime effectively never elapses while the user is filling the form. The
 * widget renders into the reserved slot the artboard already draws.
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
    },
  ) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  /** Resolves with a fresh token, or null if the widget could not produce one. */
  getToken: () => Promise<string | null>;
  reset: () => void;
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
  const pendingRef = useRef<((token: string | null) => void) | null>(null);
  const [ready, setReady] = useState(false);

  const settle = (token: string | null) => {
    const resolve = pendingRef.current;
    pendingRef.current = null;
    resolve?.(token);
  };

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
    });
    setReady(true);
  }, [siteKey]);

  useImperativeHandle(
    ref,
    () => ({
      getToken: () =>
        new Promise((resolve) => {
          const api = window.turnstile;
          const widgetId = widgetIdRef.current;
          if (!api || widgetId === null) {
            resolve(null);
            return;
          }
          pendingRef.current = resolve;
          // A widget that has already produced a token must be reset before it
          // will produce another.
          api.reset(widgetId);
          api.execute(widgetId);
        }),
      reset: () => {
        const api = window.turnstile;
        const widgetId = widgetIdRef.current;
        if (api && widgetId !== null) api.reset(widgetId);
      },
    }),
    [],
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
