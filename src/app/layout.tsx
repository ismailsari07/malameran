import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

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
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
