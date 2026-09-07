import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { Card, YouPill } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Marker } from "@/components/ui/marker";
import { Rule } from "@/components/ui/rule";
import { pageMetadata } from "@/lib/seo";

/**
 * TEMPORARY — delete before delivery.
 *
 * Renders every design token so the values in globals.css can be checked
 * against docs/design.md and the artboards in design/ side by side.
 * Tracked as an open item in docs/tasks/f1-a.md.
 */

export const metadata: Metadata = pageMetadata({
  title: "Design tokens (internal)",
  description:
    "Internal verification page for the design tokens. Deleted before launch.",
  path: "/tokens",
});

type Swatch = { name: string; hex: string; role: string };

const core: Swatch[] = [
  { name: "ink", hex: "#1A191E", role: "Primary text on paper" },
  { name: "paper", hex: "#F9F9F7", role: "Page background" },
  {
    name: "accent",
    hex: "#E2751B",
    role: "Brand orange — CTAs, eyebrows, focus",
  },
  { name: "head-bg", hex: "#1F1E23", role: "Site header" },
  { name: "footer", hex: "#151418", role: "Footer" },
  { name: "line", hex: "#DCDBD6", role: "Border / divider, form pages" },
  { name: "muted", hex: "#6C6A66", role: "Secondary text, form pages" },
  { name: "err", hex: "#B4402A", role: "Error border, text, icon fill" },
];

const darkSurfaces: Swatch[] = [
  {
    name: "on-accent",
    hex: "#101010",
    role: "Label on accent; color-mix base",
  },
  {
    name: "select-option",
    hex: "#111111",
    role: "<option> text in dark selects",
  },
  {
    name: "border-dark-card",
    hex: "#2A292E",
    role: "Dark sidebar card on light page",
  },
  {
    name: "step-complete",
    hex: "#8A4408",
    role: "Numeral on a completed step pill",
  },
];

const lightSurfaces: Swatch[] = [
  { name: "surface", hex: "#FFFFFF", role: "Form card, input, chip, file row" },
  { name: "surface-dropzone", hex: "#FCFCFA", role: "File dropzone interior" },
  { name: "surface-info", hex: "#F4F3EF", role: "Info panel; locked input" },
  { name: "border-card", hex: "#E4E3DF", role: "Card border on paper" },
  { name: "rule", hex: "#DDDCD8", role: "Hairline between prose blocks" },
  { name: "track-idle", hex: "#DEDDD8", role: "Inactive step-progress track" },
  {
    name: "border-field",
    hex: "#D3D2CC",
    role: "Input / select / chip border",
  },
  { name: "track", hex: "#EDECE8", role: "Upload progress; success divider" },
  { name: "border-reserved", hex: "#E2E1DC", role: "Dashed verification slot" },
  { name: "border-dropzone", hex: "#C4C2BB", role: "Dashed dropzone" },
  {
    name: "border-dashed-field",
    hex: "#C9C7C0",
    role: 'Dashed "add another" input',
  },
  { name: "border-hover", hex: "#A9A6A0", role: "Chip / Back button hover" },
  { name: "placeholder", hex: "#A6A39D", role: "Placeholder, light forms" },
  {
    name: "disabled",
    hex: "#B0ADA6",
    role: "Disabled Back; reserved-slot text",
  },
  { name: "numeral-idle", hex: "#B9B7B1", role: "Dimmed step numeral" },
];

const text: Swatch[] = [
  { name: "text-label", hex: "#26251F", role: "Form field labels" },
  { name: "text-prose", hex: "#1E1E1C", role: "Long-form prose" },
  { name: "text-body", hex: "#3A3936", role: "Card body on paper" },
  {
    name: "text-body-alt",
    hex: "#3A3833",
    role: "Body on form pages; chip label",
  },
  { name: "text-support", hex: "#5A5852", role: "Card body / supporting copy" },
  { name: "text-eyebrow", hex: "#8A8882", role: "Muted uppercase eyebrow" },
  {
    name: "text-small",
    hex: "#918E88",
    role: "Small print, Optional tags, hints",
  },
  { name: "chevron", hex: "#8B8880", role: "Select chevron, light" },
];

const error: Swatch[] = [
  { name: "err-heading", hex: "#7E2C1B", role: "Error banner heading" },
  { name: "err-body", hex: "#6B3327", role: "Error banner body" },
  {
    name: "err-border",
    hex: "#E5C3BA",
    role: "Error banner / issue pill border",
  },
  { name: "err-bg", hex: "#FCF3F1", role: "Error banner background" },
  {
    name: "err-field-bg",
    hex: "#FDF7F5",
    role: "Invalid input; rejected dropzone",
  },
  {
    name: "err-border-hover",
    hex: "#E0BFB6",
    role: "Remove button hover border",
  },
];

const grounds = [
  {
    cls: "ground-hero-home",
    label: "--dark-hero-home",
    note: "Home hero · paper-fade + 15% glow",
  },
  {
    cls: "ground-hero",
    label: "--dark-hero",
    note: "Inner-page hero · paper-fade + 14% glow",
  },
  {
    cls: "ground-hero-form",
    label: "--dark-hero-form",
    note: "Contact · no fade + 13% glow",
  },
  {
    cls: "ground-soft",
    label: "--dark-soft",
    note: "Alternating section · paper-fade + 9% glow",
  },
  {
    cls: "ground-quiet",
    label: "--dark-quiet",
    note: "Marketing quiet band",
  },
  {
    cls: "ground-quiet-form",
    label: "--dark-quiet-form",
    note: "Form-page sidebar · 10% glow",
  },
  {
    cls: "ground-strong",
    label: "--dark-strong",
    note: "Final CTA · 20% glow from below",
  },
];

const paired = [
  ["t-h1-hero", "Home hero", "44 / 1.0", "82 / 0.98"],
  ["t-h1-request", "/request hero", "36 / 1.04", "56 / 1.02"],
  ["t-h1-apply", "/suppliers/apply hero", "33 / 1.06", "52 / 1.04"],
  ["t-h2-section", "Section heading", "36 / 1.05", "56 / 1.03"],
  ["t-h2-cta", "Home closing band", "44 / 1.0", "76 / 1.0"],
  ["t-h2-panel", "Suppliers card panel", "30 / 1.1", "40 / 1.08"],
  ["t-h3-card", "Step card heading", "21", "23"],
  ["t-h3-industry", "Industry card heading", "21", "24"],
  ["t-h3-card-sm", "Service tile heading", "19", "20"],
  ["t-numeral-step", "Step card numeral", "46 / lh 1", "64 / lh 1"],
  ["t-numeral-trust", "Trust card numeral", "48 / lh 0.9", "64 / lh 0.9"],
  ["t-numeral-tile", "Service tile numeral", "23", "26"],
  ["t-eyebrow", "Section eyebrow", "11", "12.5"],
  ["t-eyebrow-sm", "Card eyebrow", "11", "11.5"],
  ["t-lead", "Hero lead paragraph", "17", "19"],
  ["t-prose", "Long-form prose", "17", "18"],
  ["t-hint", "Hint under a field", "13", "13.5"],
] as const;

const single = [
  ["t-h1-page", "Inner-page hero", "68"],
  ["t-h1-contact", "Contact hero", "64"],
  ["t-h2-cta-page", "Inner-page closing band", "72"],
  ["t-h2-statement", "Centred statement", "44"],
  ["t-h2-industry", "Industry section heading", "38"],
  ["t-h2-step", "How It Works step row", "34"],
  ["t-h2-form-card", "Contact form-card heading", "30"],
  ["t-h2-success-request", "Request success", "52"],
  ["t-h2-success-apply", "Application success", "50"],
  ["t-h3-card-lg", "Large card heading", "26"],
  ["t-h3-aside", "Form sidebar heading", "26 / 1.15 / -0.025em"],
  ["t-h3-process", "Process step heading", "22"],
  ["t-numeral-row", "Step row numeral", "64 / 700 / lh 0.9"],
  ["t-numeral-criteria", "Criteria card numeral", "56 / 700 / lh 0.9"],
  ["t-numeral-service", "Services page numeral", "26 / 700"],
  ["t-body-lg", "Card body, large", "16.5 / 1.6"],
  ["t-body", "Body / list row", "16 / 1.5"],
  ["t-body-sm", "Card body, small", "15.5 / 1.55"],
  ["t-fineprint", "Fine print, reassurance", "15 / 1.5"],
  ["t-label", "Form field label", "14.5 / 600"],
] as const;

const chromePaired = [
  ["t-wordmark", "Site-header wordmark", "17", "21"],
  ["t-wordmark-md", "App-header and footer wordmark", "17", "19"],
  ["t-link-back", '"Back to site"', "13.5", "14.5"],
] as const;

const chromeSingle = [
  ["t-nav", "Header nav link", "15 / 500"],
  ["t-btn", "Primary button label", "17 / 700"],
  ["t-btn-sm", "Header CTA, inline retry", "15 / 700"],
  ["t-btn-step", "Step-nav button", "15.5 / 700"],
  ["t-btn-ghost", "Ghost button on dark", "16 / 600"],
  ["t-btn-secondary", "Secondary button on light", "15.5 / 600"],
  ["t-btn-xs", "Remove / Cancel", "13.5 / 600"],
  ["t-link-cta", "Text link CTA", "16 / 500"],
  ["t-footer-link", "Footer link", "15 / 400, no line-height"],
  ["t-footer-note", "Footer description, address", "15 / 1.55"],
  ["t-legal", "Copyright, legal links", "14 / 400"],
  ["t-eyebrow-xs", "Footer heading, You pill", "11 / 600, flat"],
] as const;

const buttonVariants: ReadonlyArray<readonly [ButtonVariant, string, boolean]> =
  [
    ["primary", "Hero and form submit — 17/700, 19px 30px, r14", false],
    ["primary-sm", "Site-header CTA — 15/700, 13px 22px, r12", false],
    ["primary-step", "Step-nav Continue — 15.5/700, 15px 28px, r12", false],
    ["primary-retry", "Inline retry — 15/700, 13px 22px, r12", false],
    ["ghost", "Ghost on dark — 16/600, 16px 26px, r12", true],
    ["secondary", "Secondary on light — 15.5/600, 14px 22px, r12", false],
    ["destructive", "Remove / Cancel — 13.5/600, 7px 12px, r8", false],
    ["disabled", "Disabled — accent 42%, label at 55%", false],
    ["link", "Text link CTA — 16/500, underlined", true],
  ];

const radii = [
  ["pill", "999px", "Pills, chips, step numerals, spinner"],
  ["28", "28px", "Largest panels"],
  ["24", "24px", "App-form card, sidebar card"],
  ["22", "22px", "Standard large card"],
  ["20", "20px", "Standard card"],
  ["18", "18px", "Mobile card"],
  ["16", "16px", "File dropzone"],
  ["14", "14px", "Primary button, bullet card"],
  ["12", "12px", "Input, select, secondary button"],
  ["8", "8px", "Remove / Cancel button"],
  ["6", "6px", "Checkbox"],
  ["2", "2px", "Progress track, square marker"],
] as const;

function SwatchGrid({ title, items }: { title: string; items: Swatch[] }) {
  return (
    <section className="mt-12">
      <h3 className="t-eyebrow text-text-small">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div
            key={s.name}
            className="rounded-12 border-border-card flex items-center gap-4 border p-3"
          >
            <div
              className="rounded-8 border-border-field h-12 w-12 flex-none border"
              style={{ background: s.hex }}
            />
            <div className="min-w-0">
              <div className="t-label text-ink">--color-{s.name}</div>
              <div className="t-hint text-text-small font-mono">{s.hex}</div>
              <div className="t-hint text-text-support mt-0.5">{s.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 lg:px-10">
      <div className="rounded-14 border-err-border bg-err-bg border p-4">
        <div className="t-label text-err-heading">
          TEMPORARY — internal token verification page
        </div>
        <div className="t-body-sm text-err-body mt-1">
          Not linked from anywhere and excluded from indexing. Delete this route
          before delivery; it is tracked as an open item in docs/tasks/f1-a.md.
        </div>
      </div>

      <h1 className="t-h1-page text-ink mt-12">Design tokens</h1>
      <p className="t-lead text-muted mt-4">
        Every value read from docs/design.md. Check against the artboards in
        design/ at 375px and 1440px.
      </p>

      <h2 className="t-h2-section text-ink mt-16">Colour</h2>
      <SwatchGrid title="Core" items={core} />
      <SwatchGrid title="Dark surfaces" items={darkSurfaces} />
      <SwatchGrid title="Light surfaces" items={lightSurfaces} />
      <SwatchGrid title="Text" items={text} />
      <SwatchGrid title="Error palette" items={error} />

      <h2 className="t-h2-section text-ink mt-16">Dark grounds</h2>
      <p className="t-body-sm text-text-support mt-2">
        Layered gradients. Each band is 200px so the radial glow and the bottom
        paper-fade are both visible.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        {grounds.map((g) => (
          <div
            key={g.cls}
            className={`${g.cls} rounded-20 p-6`}
            style={{ height: 200 }}
          >
            <div className="t-eyebrow-sm text-accent">{g.label}</div>
            <div className="t-body-sm mt-2 text-white/70">.{g.cls}</div>
            <div className="t-hint mt-1 text-white/50">{g.note}</div>
          </div>
        ))}
      </div>

      <h2 className="t-h2-section text-ink mt-16">Typography</h2>
      <p className="t-body-sm text-text-support mt-2">
        36 roles. 17 have a real 375 ↔ 1440 pair and change at the lg
        breakpoint; 19 exist once in the source and do not scale yet.
      </p>

      <h3 className="t-eyebrow text-text-small mt-10">
        Paired — resize the window past 1024px to see the second value
      </h3>
      <div className="mt-4 flex flex-col gap-6">
        {paired.map(([cls, role, m, d]) => (
          <div key={cls} className="border-border-card border-b pb-6">
            <div className="t-hint text-text-small font-mono">
              .{cls} — {role} — mobile {m} · desktop {d}
            </div>
            <div className={`${cls} text-ink mt-2`}>Tell us what you need</div>
          </div>
        ))}
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">
        Single-size — no mobile counterpart in the source
      </h3>
      <div className="mt-4 flex flex-col gap-6">
        {single.map(([cls, role, size]) => (
          <div key={cls} className="border-border-card border-b pb-6">
            <div className="t-hint text-text-small font-mono">
              .{cls} — {role} — {size}
            </div>
            <div className={`${cls} text-ink mt-2`}>Tell us what you need</div>
          </div>
        ))}
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">
        Chrome — header, footer, buttons and links (added in block 2)
      </h3>
      <div className="mt-4 flex flex-col gap-6">
        {chromePaired.map(([cls, role, m, d]) => (
          <div key={cls} className="border-border-card border-b pb-6">
            <div className="t-hint text-text-small font-mono">
              .{cls} — {role} — mobile {m} · desktop {d}
            </div>
            <div className={`${cls} text-ink mt-2`}>MALAMERAN</div>
          </div>
        ))}
        {chromeSingle.map(([cls, role, size]) => (
          <div key={cls} className="border-border-card border-b pb-6">
            <div className="t-hint text-text-small font-mono">
              .{cls} — {role} — {size}
            </div>
            <div className={`${cls} text-ink mt-2`}>
              Start a sourcing request
            </div>
          </div>
        ))}
      </div>

      <h2 className="t-h2-section text-ink mt-16">Radius</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {radii.map(([name, px, role]) => (
          <div key={name} className="flex flex-col gap-2">
            <div
              className="border-border-field bg-surface h-20 border"
              style={{ borderRadius: px }}
            />
            <div className="t-label text-ink">rounded-{name}</div>
            <div className="t-hint text-text-small font-mono">{px}</div>
            <div className="t-hint text-text-support">{role}</div>
          </div>
        ))}
      </div>

      <h2 className="t-h2-section text-ink mt-16">Focus</h2>
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="t-label text-text-label mb-2">
            Light form — .focus-ring (click in)
          </div>
          <input
            type="text"
            placeholder="Aluminium window profiles"
            className="rounded-12 border-border-field bg-surface text-ink placeholder:text-placeholder focus:focus-ring w-full border px-4 py-3.5 outline-none"
          />
          <div className="t-hint text-text-small mt-2 font-mono">
            border accent + box-shadow 0 0 0 3px rgba(226,117,27,0.20)
          </div>
        </div>
        <div className="ground-quiet rounded-20 p-6">
          <div className="t-label mb-2 text-white/90">
            Dark form — .focus-ring-dark (click in)
          </div>
          <input
            type="text"
            placeholder="Jane Doe"
            className="rounded-12 focus:focus-ring-dark w-full border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30"
          />
          <div className="t-hint mt-2 font-mono text-white/50">
            accent border only — the source gives dark fields no ring
          </div>
        </div>
      </div>

      <h2 className="t-h2-section text-ink mt-16">Components</h2>
      <p className="t-body-sm text-text-support mt-2">
        Block 2. Headers and the footer are full-bleed and sit outside the page
        gutter below.
      </p>

      <h3 className="t-eyebrow text-text-small mt-10">Buttons</h3>
      <div className="mt-4 flex flex-col gap-4">
        {buttonVariants.map(([variant, note, onDark]) => (
          <div
            key={variant}
            className={
              onDark
                ? "ground-quiet rounded-20 flex flex-wrap items-center gap-6 p-6"
                : "border-border-card rounded-20 flex flex-wrap items-center gap-6 border p-6"
            }
          >
            <div
              className={
                onDark
                  ? "t-hint w-full font-mono text-white/50"
                  : "t-hint text-text-small w-full font-mono"
              }
            >
              {variant} — {note}
            </div>
            <Button variant={variant}>Start a sourcing request</Button>
            <Button variant={variant} disabled>
              Disabled attribute
            </Button>
          </div>
        ))}
        <div className="border-border-card rounded-20 flex flex-wrap items-center gap-6 border p-6">
          <div className="t-hint text-text-small w-full font-mono">
            submitting — the disabled box plus the 17px mal-spin spinner
          </div>
          <Button submitting>Submitting your request</Button>
          <Button variant="primary-step" submitting>
            Continue
          </Button>
        </div>
        <div className="border-border-card rounded-20 border p-6">
          <div className="t-hint text-text-small mb-4 font-mono">
            block — buttons go full width on mobile, primary first
          </div>
          <div className="max-w-[335px]">
            <Button block>Start a sourcing request</Button>
            <Button variant="secondary" block className="mt-3">
              Talk to us first
            </Button>
          </div>
        </div>
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">Cards</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card tone="paper" pad="30-28-32" radius={20}>
          <Eyebrow tone="paper" size="card">
            paper
          </Eyebrow>
          <h4 className="t-h3-card-lg text-ink mt-3">
            Verified factories only
          </h4>
          <p className="t-body-sm text-text-support mt-3">
            Transparent over the paper ground, 1px #E4E3DF. Padding 30/28/32,
            radius 20.
          </p>
          <Rule tone="card" className="mt-4" />
          <p className="t-fineprint text-muted mt-4">
            <Marker className="mr-2 -translate-y-px" />
            Deliverable line, closed by a card rule
          </p>
        </Card>

        <div className="ground-quiet rounded-20 grid gap-4 p-6">
          <Card tone="dark" pad="30-30-34">
            <div className="flex items-start justify-between">
              <span className="t-numeral-step text-accent">02</span>
              <Eyebrow tone="muted-dark" size="xs" as="span">
                Us
              </Eyebrow>
            </div>
            <h4 className="t-h3-card mt-5 text-white">We source and verify</h4>
            <p className="t-body-sm mt-3 text-white/68">
              3.5% white fill inside a 12% white border. Padding 30/30/34,
              radius 22.
            </p>
          </Card>

          <Card tone="emphasis" pad="30-30-34">
            <div className="flex items-start justify-between">
              <span className="t-numeral-step text-accent">01</span>
              <YouPill />
            </div>
            <h4 className="t-h3-card mt-5 text-white">Tell us what you need</h4>
            <p className="t-body-sm mt-3 text-white/68">
              Buyer-owned: accent 12% over #101010, accent border, the You pill.
            </p>
          </Card>

          <Card tone="statement" pad="30-30-34">
            <h4 className="t-h3-card text-white">Start a sourcing request</h4>
            <p className="t-body-sm mt-3 text-white/68">
              No fill, 22% white border — the closing action cell in a grid.
            </p>
          </Card>

          <Card tone="panel" pad="30-30-34">
            <h4 className="t-h3-card text-white">panel</h4>
            <p className="t-body-sm mt-3 text-white/68">
              No fill, 14% white border — the large centred panel.
            </p>
          </Card>

          <Card tone="dark-panel" pad="30-30-34">
            <h4 className="t-h3-card text-white">dark-panel</h4>
            <p className="t-body-sm mt-3 text-white/68">
              14% border over a 3.5% fill — the How It Works timeline aside.
            </p>
          </Card>

          <Card tone="dark-form" pad="30-30-34">
            <h4 className="t-h3-card text-white">dark-form</h4>
            <p className="t-body-sm mt-3 text-white/68">
              14% border over the faintest fill, 2% — Contact&rsquo;s form card.
            </p>
          </Card>

          <Card tone="dark-aside" pad="30-30-34">
            <h4 className="t-h3-card text-white">dark-aside</h4>
            <p className="t-body-sm mt-3 text-white/68">
              14% border over 3% — Contact&rsquo;s sidebar cards.
            </p>
          </Card>

          <Card tone="emphasis-soft" pad="30-30-34">
            <h4 className="t-h3-card text-white">emphasis-soft</h4>
            <p className="t-body-sm mt-3 text-white/68">
              Accent 12% fill, but bordered at the 45% mix rather than full
              accent — the Services &ldquo;End to end&rdquo; card.
            </p>
          </Card>
        </div>
      </div>

      <p className="t-body-sm text-text-support mt-4">
        The three light tones, and the one tone that carries its own ground.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="border-border-card rounded-20 flex flex-col gap-4 border p-6">
          <Card tone="surface" pad="26-24-28" radius={20}>
            <h4 className="t-h3-card-lg text-ink">surface</h4>
            <p className="t-body-sm text-text-support mt-3">
              White fill inside a --line border — the form card on a paper page.
            </p>
          </Card>
          <Card tone="error" pad="18-20" radius={14}>
            <p className="t-banner-heading text-err-heading">
              error — the failed-submission banner
            </p>
            <p className="t-fineprint text-err-body mt-2">
              --err-border on --err-bg. Used with primary-retry.
            </p>
          </Card>
          <Card tone="info" pad="16-18" radius={14}>
            <p className="t-body text-text-body-alt">
              info — --line on --surface-info. The notice treatment on the form
              and legal pages.
            </p>
          </Card>
        </div>

        {/*
         * sidebar is the one tone that brings its own ground rather than
         * relying on an enclosing Section, so it is shown on paper — which is
         * where it is actually used, and where it silently rendered
         * transparent until the ground was applied through .ground-quiet.
         */}
        <Card tone="sidebar" pad="32-30-34" radius={24}>
          <Eyebrow tone="dark" size="card">
            sidebar
          </Eyebrow>
          <h4 className="t-h3-card mt-3 text-white">
            Carries --dark-quiet itself
          </h4>
          <p className="t-body-sm mt-3 text-white/80">
            Applied through the .ground-quiet component class. A background
            utility pointed at the variable would emit background-color, which
            cannot hold a gradient, and would fall back to transparent with no
            warning. Guarded by pnpm check:css.
          </p>
        </Card>
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">Eyebrow, rule, marker</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="border-border-card rounded-20 flex flex-col gap-4 border p-6">
          <Eyebrow tone="paper">Section eyebrow on paper — accent 74%</Eyebrow>
          <Eyebrow tone="muted-paper" size="card">
            Muted on paper — #8A8882
          </Eyebrow>
          <Eyebrow tone="paper" size="xs">
            Flat 11px — the You pill and footer headings
          </Eyebrow>
          <Rule tone="paper" />
          <div className="t-hint text-text-small font-mono">
            .bg-rule between prose blocks
          </div>
          <Rule tone="card" />
          <div className="t-hint text-text-small font-mono">
            .bg-border-card inside a card
          </div>
          <div className="t-body-sm text-text-body flex items-center">
            <Marker size={9} className="mr-2" /> 9px marker
            <Marker className="mr-2 ml-6" /> 10px marker
          </div>
        </div>
        <div className="ground-quiet rounded-20 flex flex-col gap-4 p-6">
          <Eyebrow tone="dark">Section eyebrow on dark — accent</Eyebrow>
          <Eyebrow tone="muted-dark" size="xs">
            Muted on dark — white 38%
          </Eyebrow>
          <Rule tone="dark" />
          <div className="t-hint font-mono text-white/50">white/12 on dark</div>
          <Rule tone="dark-faint" />
          <div className="t-hint font-mono text-white/50">
            white/9 — header and footer edges
          </div>
        </div>
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">
        Mobile menu — authored, no artboard exists
      </h3>
      <p className="t-body-sm text-text-support mt-2">
        The real component. Below 1024px the hamburger appears in the site
        header below; clicking it opens the panel over the whole viewport.
        Escape closes it, Tab cycles inside it, focus returns to the hamburger.
      </p>
      <div className="border-border-card rounded-20 mt-4 border p-6">
        <div className="bg-head-bg flex h-16 max-w-[375px] items-center justify-between px-5">
          <span className="t-wordmark text-white">MALAMERAN</span>
          <MobileMenu />
        </div>
      </div>

      <h3 className="t-eyebrow text-text-small mt-12">Header and footer</h3>
      <p className="t-body-sm text-text-support mt-2">
        Full-bleed. Resize past 1024px to see the 88px header with its nav
        replace the 64px hamburger bar.
      </p>
      <div className="-mx-5 mt-4 lg:-mx-10">
        <SiteHeader />
        <div className="ground-hero h-24" />
        <AppHeader />
        <div className="bg-paper h-24" />
        <SiteFooter />
      </div>
    </main>
  );
}
