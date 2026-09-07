import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo";

/**
 * The social card, generated from the design system rather than a committed
 * PNG or a stock photograph.
 *
 * public/malameran-emblem.png was considered and rejected: it is prototype art
 * on a #010A19 navy ground with a yellow-gold monogram, against a palette whose
 * ink is the warm #1A191E and whose accent is #E2751B. It is also a
 * globe-and-monogram motif that appears in no artboard — docs/design.md records
 * that the design ships no icons and that the mark is an accent square beside
 * letterspaced type. Advertising the site with a picture that contradicts its
 * palette is worse than having no picture.
 *
 * Satori (what ImageResponse renders with) supports neither CSS variables nor
 * layered background shorthand, so the --dark-hero ground is rebuilt here as
 * one linear gradient plus one radial glow. These are the same literal values
 * as globals.css, and the same exception as the email templates: a renderer
 * that cannot read a token gets the hex.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — managed global sourcing`;

const ACCENT = "#E2751B";
const INK = "#1A191E";

type Face = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 800;
  style: "normal";
};

/**
 * Satori will not use next/font, so the bytes have to be fetched. Two weights,
 * because registering only one makes Satori render every string at it — the
 * first cut of this card had its lead paragraph in 800.
 *
 * A failure degrades to the bundled default rather than failing the build: the
 * card loses Inter Tight and still renders. If this ever becomes flaky in
 * practice, commit a subset instead.
 */
async function interTight(): Promise<Face[]> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;800&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());

    // Google returns one @font-face block per weight; pair each weight with the
    // src inside its own block rather than taking the first url in the file.
    const faces = await Promise.all(
      [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map(async (block) => {
        const body = block[1] ?? "";
        const weight = Number(/font-weight:\s*(\d+)/.exec(body)?.[1]);
        const url = /src:\s*url\((https:[^)]+)\)/.exec(body)?.[1];
        if (!url || (weight !== 400 && weight !== 800)) return null;
        const data = await fetch(url).then((r) => r.arrayBuffer());
        return { name: "Inter Tight", data, weight, style: "normal" } as Face;
      }),
    );
    return faces.filter((f): f is Face => f !== null);
  } catch {
    return [];
  }
}

export default async function Image() {
  const fonts = await interTight();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: INK,
        backgroundImage: `radial-gradient(1200px 700px at 76% 16%, rgba(226,117,27,0.22) 0%, rgba(226,117,27,0) 70%), linear-gradient(168deg, #201F24 0%, #1A191E 55%, #17171A 100%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 20, height: 20, backgroundColor: ACCENT }} />
        <div
          style={{
            marginLeft: 18,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.10em",
            color: "#ffffff",
          }}
        >
          MALAMERAN
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: "#ffffff",
            maxWidth: 900,
          }}
        >
          Managed global sourcing.
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.74)",
            maxWidth: 820,
          }}
        >
          One accountable party from specification to delivery.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "rgba(255,255,255,0.14)",
          }}
        />
        <div
          style={{
            marginTop: 22,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          Toronto, Canada
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
