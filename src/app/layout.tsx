import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site-wide defaults. Everything per-page comes from `pageMetadata()` in
 * src/lib/seo.ts.
 *
 * `metadataBase` is what makes a relative canonical and a relative OG image URL
 * resolve to absolute ones. It is built from NEXT_PUBLIC_SITE_URL, so that
 * variable being wrong breaks the canonicals, the sitemap and the social image
 * together and silently — it is on the pre-launch checklist for that reason.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // TODO(copy): title template and default description pending client copy.
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Global sourcing and procurement. One accountable party from specification to delivery.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full`}
    >
      {/*
       * Chrome lives in the route-group layouts, not here: (site) pages get the
       * marketing header and footer, (form) pages get the reduced app header and
       * no footer. not-found.tsx sits outside both groups and renders its own.
       */}
      <body className="flex min-h-full flex-col">
        {children}
        {/* Renders nothing at all unless a measurement ID is set in production. */}
        <Analytics />
      </body>
    </html>
  );
}
