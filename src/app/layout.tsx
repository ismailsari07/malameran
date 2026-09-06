import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

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
 * Site-wide skeleton only. Per-page title, description and Open Graph live on
 * the page; full SEO — sitemap, canonicals, social images — is block 10.
 */
export const metadata: Metadata = {
  // TODO(copy): title template and default description pending client copy.
  title: {
    default: "Malameran",
    template: "%s · Malameran",
  },
  description:
    "Managed global sourcing. One accountable party from specification to delivery.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
