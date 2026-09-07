import Script from "next/script";

import { isProduction, publicEnv } from "@/lib/env";

/**
 * Google Analytics 4, cookieless, and inert until a measurement ID exists.
 *
 * With no `NEXT_PUBLIC_GA_MEASUREMENT_ID` this renders `null`: no script tag,
 * no inline snippet, and no request to Google from anywhere. It also stays off
 * in development whatever the ID is, so local traffic never reaches the
 * client's property. Turning it on at delivery is setting one variable.
 *
 * `client_storage: "none"` is the setting that matters. GA4 then writes no _ga
 * cookie and no localStorage entry, so nothing identifying is stored in the
 * browser and there is nothing to ask consent to store.
 *
 * What that costs, stated plainly because it is easy to discover too late:
 * without a stored client id GA4 mints a new one on every page view, so there
 * are no returning visitors, no multi-page sessions, no funnels and no
 * attribution. It answers "how much traffic, to which pages, from where". It
 * cannot answer "who came back" or "what path led to a submission".
 *
 * `anonymize_ip` is deliberately NOT passed. GA4 anonymises unconditionally and
 * ignores the parameter; setting it would look like a control we have and do
 * not.
 *
 * WARNING: src/content/privacy.ts still says no analytics provider has been
 * selected. Setting the measurement ID makes a published legal document false.
 * The policy copy and the ID have to move in the same change — see
 * docs/tasks/f1-a.md.
 */
export function Analytics() {
  const id = publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || !isProduction) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)}, {
  client_storage: 'none',
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
      </Script>
    </>
  );
}
