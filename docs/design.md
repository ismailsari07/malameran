# Design reference

Extracted from `design/*.html` (Claude Design canvas export). Every value below is read
from those files — nothing is rounded or invented. This is a reference document; the
canvas files are never imported by the app.

Source files: `Site Header`, `Site Footer`, `Malameran Home`, `How It Works`, `Services`,
`Industries`, `For Suppliers`, `About`, `Contact`, `Sourcing Request`, `Request Form`,
`Supplier Application`. (`support.js` and `image-slot.js` are canvas runtime, not design.)

## Two surfaces

The design has two distinct visual modes and they do not share a palette:

| Surface | Where | Background | Text |
| --- | --- | --- | --- |
| **Marketing** | Home, How It Works, Services, Industries, For Suppliers, About, Contact, Sourcing Request | alternating `--paper` and dark gradients | dark on paper, white on dark |
| **App form** | Request Form (`/request`), Supplier Application (`/suppliers/apply`) | `--paper` page, `#fff` form card | dark throughout; one dark sidebar card |

Notably: the sourcing-request form on `Malameran Sourcing Request` is **dark-on-dark**,
while the same form rebuilt in `Malameran Request Form` is **light**. The Request Form /
Supplier Application pair is the later, more considered treatment — it has step states,
validation, upload, success and failure states.

**Decided 2026-09-05:** the light Request Form treatment wins. The dark
`Malameran Sourcing Request` artboard is discarded and will not be built — see
`docs/decisions.md`. Its type values are therefore not implemented; `/request` takes the
Request Form pair and `/suppliers/apply` the Supplier Application pair.

---

## 1. Colour tokens

### Declared CSS variables

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#1A191E` | Primary text on paper; darkest base colour |
| `--paper` | `#F9F9F7` | Page background, light sections |
| `--accent` | `#E2751B` | Brand orange — CTAs, eyebrows, numerals, focus |
| `--head-bg` | `#1F1E23` | Site header background |
| `--line` | `#DCDBD6` | Border/divider on form pages only |
| `--muted` | `#6C6A66` | Secondary text on form pages |
| `--err` | `#B4402A` | Error borders, error text, error icon fill |
| `--you` | `= var(--accent)` | Highlight for buyer-owned steps (toggleable prop) |

Accent is a canvas prop with alternates offered: `#E2751B` (default), `#D9601F`,
`#C8791A`, `#E08A2B`. Only `#E2751B` is used in the layouts.

### Dark backgrounds (gradient tokens)

Layered gradients, not flat fills. The source reuses two names for different values —
`--dark-hero` appears with three different glow strengths and `--dark-quiet` with two
compositions. See "Grounds: three `--dark-hero` variants" under Notes for implementation for
how they are split in code.

| Token | Composition |
| --- | --- |
| `--dark-hero` | paper-fade at bottom → radial accent glow `1200px 700px at 76% 16%` at 15% (Home), 14% (inner pages) or 13% with no paper-fade (Contact, Sourcing Request) → `linear-gradient(168deg, #201F24 0%, #1A191E 55%, #17171A 100%)` |
| `--dark-soft` | paper-fade at bottom → radial accent glow `1000px 620px at 10% 6%` at 9% → `linear-gradient(180deg, #1C1B20 0%, #17171A 100%)` |
| `--dark-quiet` | `linear-gradient(180deg, #1A191E 0%, #18171C 100%)` (marketing pages) |
| `--dark-quiet` | `radial-gradient(700px 480px at 90% 4%, accent 10%, transparent)` → `linear-gradient(180deg, #1E1D22 0%, #17171A 100%)` (form pages — same name, different value) |
| `--dark-strong` | `radial-gradient(1100px 680px at 50% 118%, accent 20%, transparent)` → `linear-gradient(180deg, #17171A 0%, #1E1D22 100%)` — final CTA band |

The bottom paper-fade on `--dark-hero`/`--dark-soft` is:
`linear-gradient(180deg, rgba(249,249,247,0) calc(100% - 160px), rgba(249,249,247,0.045) calc(100% - 60px), rgba(249,249,247,0.13) 100%)`

Gradient stop colours in use: `#201F24`, `#1E1D22`, `#1C1B20`, `#1A191E`, `#18171C`, `#17171A`.

### Flat colours — dark surfaces

| Hex | Role |
| --- | --- |
| `#1F1E23` | Header bar |
| `#151418` | Footer |
| `#101010` | Button label on accent; darkening base for `color-mix` |
| `#111` | `<option>` text inside dark selects (native dropdown legibility) |
| `#2A292E` | Border of the dark sidebar card on light form pages |
| `#8A4408` | Numeral on a completed step pill |

### Flat colours — light surfaces

| Hex | Role |
| --- | --- |
| `#F9F9F7` | Paper (page background) |
| `#FFFFFF` | Form card, input, chip, file-row backgrounds |
| `#FCFCFA` | File dropzone interior |
| `#F4F3EF` | Info panel background; read-only/locked input background |
| `#E4E3E0` | Canvas surround outside the artboards — **not a site colour** |
| `#E4E3DF` | Card border on paper (marketing sections) |
| `#DDDCD8` | Hairline rule between prose blocks (marketing) |
| `#DCDBD6` | Border/divider (`--line`, form pages) |
| `#DEDDD8` | Inactive step-progress track |
| `#D3D2CC` | Input / select / chip border (light forms) |
| `#EDECE8` | Upload progress track; divider inside success card |
| `#E2E1DC` | Dashed border of the reserved verification-challenge slot |
| `#C4C2BB` | Dashed border of the file dropzone |
| `#C9C7C0` | Dashed border of the "add another certification" input |
| `#A9A6A0` | Chip / Back-button border on hover |
| `#A6A39D` | Input placeholder text (light forms); disabled Back label on mobile |
| `#B0ADA6` | Back label when disabled at step 1; verification-slot placeholder text |
| `#B9B7B1` | Dimmed step numeral for the steps the buyer does not own (02, 04, 05) |

### Text colours

| Hex | Role |
| --- | --- |
| `#1A191E` | Headings and primary text on paper (`--ink`) |
| `#26251F` | Form field labels |
| `#1E1E1C` | Long-form prose (Home "the problem", About) |
| `#3A3936` | Body copy in cards on paper (marketing) |
| `#3A3833` | Body copy on form pages; chip label |
| `#5A5852` | Card body / supporting copy on paper |
| `#6C6A66` | Muted text, deliverable lines, artboard labels (`--muted`) |
| `#8A8882` | Muted uppercase eyebrow on paper |
| `#918E88` | Small print, "Optional" tags, hints, step counters |
| `#8B8880` | Select chevron stroke (light) |

### White at opacity (all text/border on dark)

| Value | Role |
| --- | --- |
| `rgba(255,255,255,0.9)` | Form label text; chip label on dark |
| `#fff` | Headings, emphasis, link hover |
| `0.80` / `0.78` | Sidebar body copy |
| `0.74` | Hero subheading |
| `0.72` | Nav link rest state; card body |
| `0.68` | Card body copy |
| `0.66` | Footer link |
| `0.62` / `0.60` | Secondary card copy; "Back to site" link |
| `0.56` | Reassurance line under the hero CTA |
| `0.55` / `0.5` | Footer paragraph, label above contact detail |
| `0.48` | Fine print under a submit button |
| `0.45` / `0.42` / `0.40` / `0.38` | Uppercase eyebrows and column headings, ascending faintness |
| `0.32` | Placeholder text in dark inputs |
| `0.22` | Border of the emphasis card; timeline node ring |
| `0.18` | Border of nested cards and pills |
| `0.16` | Timeline connector line |
| `0.14` | Standard border on dark cards and inputs; hero rules |
| `0.13` | Hero-panel border |
| `0.12` | Standard border, dark step/industry cards |
| `0.10` / `0.09` | Header bottom border; footer top border |
| `0.06` | Ghost-button hover fill |
| `0.045` | Dark input background |
| `0.04` / `0.035` / `0.03` / `0.02` | Card fills on dark, faintest to lightest use order |

### Error palette (form pages)

| Hex | Role |
| --- | --- |
| `#B4402A` | `--err` — invalid field border, inline error text, error icon fill |
| `#7E2C1B` | Error banner heading |
| `#6B3327` | Error banner body |
| `#E5C3BA` | Error banner / issue-pill border |
| `#FCF3F1` | Error banner background |
| `#FDF7F5` | Invalid input background; rejected-file dropzone background |
| `#E0BFB6` | Remove-button border on hover |

### Derived colours (`color-mix`, oklab)

These are computed, not literal. Keep them as functions of the accent rather than baking hexes.

| Expression | Role |
| --- | --- |
| `accent 88%, #101010` | Step numerals and eyebrow numerals on paper |
| `accent 82%, #ffffff` | Primary button hover |
| `accent 74%, #101010` | Section eyebrow (uppercase) on paper |
| `accent 60%, #101010` | "You" pill border on dark |
| `accent 45%, #1A191E` | Border of any accent-tinted card: the hero diagram's MALAMERAN card and the Services "End to end" card. Implemented as `--accent-tint-border` |
| `accent 42%, #F4F3EF` | Disabled/submitting button fill |
| `accent 22%, #ffffff` | Selected chip fill (light) |
| `accent 20%, #ffffff` | Completed step-pill fill |
| `accent 20%, #17171A` | Active timeline node fill |
| `accent 18%, #1A191E` | Accent-tinted "MALAMERAN" card in the hero diagram |
| `accent 12%, #101010` | Buyer-owned step card fill on dark |
| `accent 75%, transparent` | Vertical connector line in the hero diagram |
| `accent 18%, #1A191E` | Accent MALAMERAN card in the hero diagram |
| `accent 20% / 15% / 14% / 13% / 10% / 9%, transparent` | Radial glow intensities in the dark grounds |

---

## 2. Typography

Two families, loaded from Google Fonts:

```
Inter Tight — 400,500,600,700,800
Inter       — 400,500,600,700
```

- Body: `'Inter', system-ui, sans-serif`, `-webkit-font-smoothing: antialiased`
- Display: `'Inter Tight', 'Inter', system-ui, sans-serif` — applied to `h1, h2, h3` and
  the `.tight` utility class. Used for headings, step numerals, the wordmark, and any
  large number.

Weights in use: **500, 600, 700, 800**. 400 is loaded but never applied explicitly.

### Type scale as used

| Role | Size | Weight | Line height | Letter spacing | Family |
| --- | --- | --- | --- | --- | --- |
| Home hero h1 (desktop) | 82px | 800 | 0.98 | −0.035em | Tight |
| Final CTA h2 (Home) | 76px | 800 | 1.0 | −0.035em | Tight |
| Final CTA h2 (inner pages) | 72px | 800 | 1.0 | −0.035em | Tight |
| Inner-page h1 | 68px | 800 | 1.0 | −0.035em | Tight |
| Form-page h1 / short h1 | 64px | 800 | 1.02 | −0.035em | Tight |
| Section h2 | 56px | 800 | 1.03 | −0.03em | Tight |
| App-form h1 (`/request`) | 56px | 800 | 1.02 | −0.035em | Tight |
| Why-we-exist h2 (About) | 52px | 800 | 1.03 | −0.03em | Tight |
| Success h2 | 52px / 50px | 800 | 1.03 / 1.04 | −0.035em | Tight |
| Supplier-apply h1 | 52px | 800 | 1.04 | −0.035em | Tight |
| Centred panel h2 | 44px | 700 | 1.08 | −0.028em | Tight |
| Mobile hero h1 | 44px | 800 | 1.0 | −0.035em | Tight |
| Stat figure ("2 days") | 44px | 700 | 1 | −0.035em | Tight |
| Card-CTA h2 | 40px | 700 | 1.08 | −0.025em | Tight |
| Industry section h2 | 38px | 700 | 1.08 | −0.025em | Tight |
| Mobile form h1 | 38px / 36px / 33px | 800 | 1.03–1.06 | −0.035em | Tight |
| Mobile section h2 | 36px | 800 | 1.05 | −0.03em | Tight |
| Step h2 (How It Works) | 34px | 700 | 1.1 | −0.025em | Tight |
| Form-card h2 (Contact) | 30px | 700 | — | −0.02em | Tight |
| Mobile panel h2 | 30px | 700 | 1.1 | −0.025em | Tight |
| Engagement-model h3 | 28px | 700 | — | −0.02em | Tight |
| Card h3 (large) | 26px | 700 | — | −0.02em | Tight |
| Stat value (About) | 26px | 700 | — | −0.02em | Tight |
| Sidebar heading | 26px | 700 | 1.15 | −0.025em | Tight |
| Card h3 (industries) | 24px | 700 | — | −0.02em | Tight |
| Step card h3 | 23px | 700 | — | −0.015em | Tight |
| Process h3 | 22px | 700 | — | −0.015em | Tight |
| Mobile step h3 | 21px | 700 | — | −0.015em | Tight |
| Service card h3 | 20px | 700 | — | −0.012em | Tight |
| Diagram node title | 20px / 19px | 700 | — | — | Tight |
| Wordmark (header) | 21px desktop / 19px compact / 17px mobile | 700 | — | +0.10em | Tight |
| Numeral, large | 64px | 800 (700 in step lists) | 1 / 0.9 | −0.045em | Tight |
| Numeral, medium | 56px / 48px / 46px | 700–800 | 0.9 / 1 | −0.045em | Tight |
| Numeral, small | 26px / 23px | 800 (700 on Services) | 1 | −0.03em | Tight/Inter |
| Hero lead paragraph | 19px | 400 | 1.55 | — | Inter |
| Lead / success paragraph | 19px | 400 | 1.5–1.55 | — | Inter |
| Long-form prose | 18px | 400 | 1.65 | — | Inter |
| Trust-card statement | 20px / 18px | 500 | 1.45 | — | Inter |
| Body (form page intro) | 18.5px / 18px | 400 | 1.5–1.6 | — | Inter |
| Body (step / industry copy) | 17.5px | 400 | 1.6 | — | Inter |
| Primary button label | 17px | 700 | — | — | Inter |
| Mobile body | 17px | 400 | 1.55 | — | Inter |
| Card body (large) | 16.5px | 400 | 1.6 | — | Inter |
| Dropzone title | 16.5px | 600 | — | — | Inter |
| Error banner heading | 16.5px | 700 | — | — | Inter |
| Input / textarea / select text | 16px | 400 | 1.5 (textarea) | — | Inter |
| Body / list row | 16px | 400 | 1.5–1.6 | — | Inter |
| Secondary button label | 16px | 600 | — | — | Inter |
| Card body (small) | 15.5px | 400 | 1.5–1.55 | — | Inter |
| Step-nav button label | 15.5px | 600 / 700 | — | — | Inter |
| Nav link / footer link | 15px | 500 / 400 | — | — | Inter |
| Fine print, reassurance | 15px | 400 | 1.5–1.55 | — | Inter |
| Field label | 14.5px | 600 | — | — | Inter |
| "Back to site" link | 14.5px | 500 | — | — | Inter |
| Inline error message | 14px | 500 | 1.45 | — | Inter |
| Legal / copyright | 14px | 400 | — | — | Inter |
| Hint under a field | 13.5px / 13px | 400 | — | — | Inter |
| Remove/Cancel button | 13.5px | 600 | — | — | Inter |
| Eyebrow, section (desktop) | 12.5px | 600 | — | +0.06em, uppercase | Inter |
| State label (states gallery) | 12.5px | 700 | — | +0.05em, uppercase | Inter |
| Artboard label | 12px | 600 | — | +0.06em, uppercase | Inter |
| Eyebrow, card / sidebar | 11.5px | 600 | — | +0.06em, uppercase | Inter |
| "Optional" tag | 11.5px / 11px | 500 | — | +0.05em, uppercase | Inter |
| Eyebrow, small / mobile | 11px | 600 | — | +0.06em, uppercase | Inter |

`text-wrap: pretty` is set on nearly every heading and lead paragraph.

Line-height values in use: `0.9`, `0.98`, `1`, `1.02`, `1.03`, `1.04`, `1.05`, `1.06`,
`1.08`, `1.1`, `1.15`, `1.45`, `1.5`, `1.55`, `1.6`, `1.65`.

Letter-spacing values in use: `−0.045em`, `−0.035em`, `−0.03em`, `−0.028em`, `−0.025em`,
`−0.02em`, `−0.015em`, `−0.012em`, `+0.02em`, `+0.05em`, `+0.06em`, `+0.10em`.
Rule of thumb observed: the larger the type, the tighter the tracking; uppercase micro-labels
always get positive tracking.

---

## 3. Spacing, radius, shadow

### Spacing scale

Every `padding`, `margin` and `gap` value in the source, exhaustively:

`1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 19 · 20 · 22 · 24 · 26 · 28 · 30 · 32 · 34 · 36 · 38 · 40 · 42 · 44 · 48 · 52 · 56 · 60 · 64 · 72 · 80 · 88 · 96 · 104 · 112 · 120 · 124 · 128 · 140`

Above 20 it is strictly even and mostly a multiple of 4. The odd values below 20 are all
control internals — `13/15/17/19px` vertical padding on inputs and buttons, `42/44px` right
padding on selects to clear the chevron, `1/3px` for rules and progress tracks.

Common gaps: `8`, `10`, `12`, `14`, `16`, `20`, `26` (within components); `20`, `32`, `40`,
`48`, `64`, `72`, `80`, `96` (between columns and regions).

Distinctive paddings:

| Value | Where |
| --- | --- |
| `14px 16px` | Input / select / textarea (light form) |
| `15px 16px` | Input / select / textarea (dark form) |
| `15px` | Input on mobile |
| `19px 30px` | Primary button (desktop) |
| `19px 24px` / `18px` | Primary button (mobile) |
| `15px 28px` | Step-nav "Continue" button |
| `14px 22px` / `13px 22px` | Secondary and inline buttons |
| `9px 15px` / `10px 14px` | Chip |
| `6px 12px` / `5px 11px` | Tag pill |
| `5px 10px` / `4px 9px` | "You" pill |
| `7px 12px` | Remove / Cancel button |
| `16px 18px` | Bullet card (How It Works) |
| `14px 16px` | Bullet card (Industries), file row |
| `22px` | Mobile card |
| `26px 24px 28px` | Service card |
| `30px 28px 32px` | Industry / stat card |
| `30px 30px 34px` | Step card |
| `32px 32px 36px` | Service card (Services page) |
| `34px 32px 38px` | Rule / criteria card |
| `36px 34px 40px` | Trust card |
| `36px 40px 40px` | Form card (app forms) |
| `44px 44px 48px` / `44px 48px 48px` | Form card (dark forms) |
| `32px 30px 34px` | Sidebar card |
| `32px 24px` | File dropzone |
| `52px 56px 56px` | Centred CTA panel |

Cards are consistently **bottom-heavy**: the bottom padding is 2–4px greater than the top.

### Border radius

| Value | Applied to |
| --- | --- |
| `999px` | Pills, chips, step numerals, timeline nodes, spinner |
| `28px` | Largest panels — dark form card, hero diagram panel, centred CTA panel |
| `24px` | App-form card, sidebar card, mobile hero panel |
| `22px` | Standard large card (steps, trust, rules, engagement models, contact aside) |
| `20px` | Standard card (services, industries, stats, state cards, image slots) |
| `18px` | Mobile card; nested node in the hero diagram |
| `16px` | File dropzone; nested node on mobile |
| `14px` | Primary button; bullet card; info/error panel |
| `12px` | Input, select, textarea, secondary button, header CTA, file row |
| `8px` | Remove / Cancel button |
| `6px` | Checkbox |
| `2px` | Progress track; small accent square marker |

### Shadows

Only two real shadows exist:

| Value | Role |
| --- | --- |
| `0 24px 60px rgba(0,0,0,0.16)` | Artboard drop shadow — canvas presentation only, **not part of the site** |
| `0 0 0 3px rgba(226,117,27,0.20)` | Focus ring on light form fields |

Everything else written as `box-shadow` is a **borderless hairline trick**, not elevation:
`box-shadow: inset 0 0 0 1px <same colour as border>` paired with `background-clip: padding-box`,
used to keep a 1px edge crisp on translucent dark cards. In a real Tailwind build this
collapses to a plain `border` — reproduce the visual edge, not the double declaration.

The design has **no elevation system**. Depth comes from gradient grounds and hairline borders.

---

## 4. Layout

### Frame

- Desktop artboard: **1440px**. Mobile artboard: **375px**. No intermediate artboard exists.
- No `@media` queries anywhere — the responsive behaviour is implied by the two artboards
  and must be authored fresh. Definition of done already names 375px and 1440px.
- Content column: `max-width: 1200px; margin: 0 auto`
- Outer page padding: `0 40px` desktop, `0 20px` mobile
- Those two sit on **different elements** in the source — the padding is on a full-bleed
  parent, the max-width on its child — so the page is 1280px overall. Collapsed into one
  element, that is `max-width: 1280px` with the padding inside it, which is what
  `<Container>` does. A 1200px max-width with the same padding would give a 1120px column.
- Success pages use a narrower `1240px` frame with a `1160px` inner column.

### Vertical rhythm (desktop)

| Region | Padding |
| --- | --- |
| Standard section | `112px 0 120px` |
| Page hero (inner pages) | `96px 0 112px` |
| Home hero | `104px 0 120px` |
| Compact hero (Contact, Sourcing Request) | `88px 0 72px` |
| Final CTA band | `128px 0 140px` |
| Supplier-page CTA band | `112px 0 124px` |
| Success page | `96px 40px 104px` |
| App form body | `72px` top, `104px` bottom |
| Contact form band | `56px` top, `112px` bottom |
| Footer | `64px 0 36px` |

Mobile compresses everything to `64px 20px` for standard sections, `52px 20px 60px` for the
hero, `80px 20px 88px` for the final CTA, and `44px 20px 32px` for the footer.

### Grid patterns

| Pattern | Used for |
| --- | --- |
| `repeat(4, 1fr)` gap `16px` | Service tiles (Home), company stats (About) |
| `repeat(3, 1fr)` gap `20px` | Step cards, industry cards, engagement models, commitments |
| `repeat(2, 1fr)` / `1fr 1fr` gap `20px` | Trust cards, rule cards, service cards (Services) |
| `1fr 480px` gap `80px` | Home hero — copy + diagram panel |
| `1fr 520px` gap `96px` | Two-column prose (Home problem, About) |
| `1fr 420px` gap `80px` / `64px` | Hero with aside (How It Works); Contact form + aside |
| `minmax(0,1fr) 372px` gap `48px` | App form + sticky sidebar |
| `120px 1fr 1fr` gap `48px` | Numbered step row (How It Works) |
| `1fr 1fr` gap `72px` | Industry section — copy + capability chips |
| `1fr 1fr` gap `26px 24px` | Paired form fields (light) |
| `1fr 1fr` gap `22px 24px` | Paired form fields (dark) |
| `1.4fr 1fr 1fr 1.2fr` gap `40px` | Footer columns (desktop) |
| `1fr 1fr` gap `28px` | Footer columns (mobile) |

On mobile every grid collapses to a single flex column, gap `12px` for card stacks and
`20–22px` for form fields.

### Measure caps

Prose is capped rather than allowed to run the full column: `280`, `400`, `460`, `480`,
`520`, `560`, `600`, `620`, `640`, `720`, `760`, `800`, `820`, `840`, `880`, `900`px.
Body paragraphs settle around `620px`; headings around `760–900px`.

### Section rhythm

Marketing pages alternate ground colour top to bottom, ending on `--dark-strong` —
with one exception. **Contact does not close on a CTA band.** Its artboard ends on the
form section, then the footer. The visitor is already doing what a closing CTA would ask
them to do, so pushing them to `/request` from the bottom of a contact form is noise.
Decided 2026-09-05; every other marketing page ends on `--dark-strong`:

```
header (#1F1E23)
  → hero        (--dark-hero)
  → section     (--paper)
  → section     (--dark-soft)
  → section     (--paper)
  → panel       (--dark-quiet)      [optional]
  → final CTA   (--dark-strong)
footer (#151418)
```

---

## 5. Component patterns

### Header

Desktop: `#1F1E23`, height `88px`, `0 40px` outer / `1200px` inner, flex with the nav pushed
right by `margin-left:auto` and `32px` between links. Wordmark = a `13×13px` accent square +
`MALAMERAN` at 21px/700/+0.10em/`#fff`. Nav links 15px/500 at `rgba(255,255,255,0.72)`,
`#fff` on hover; the active page is `#fff`. Trailing CTA button: accent fill, `#101010` label,
15px/700, `13px 22px`, radius 12.

Mobile: height `64px`, `0 20px`, bottom border `rgba(255,255,255,0.10)`, wordmark at 17px with
an `11×11px` square, and a two-bar hamburger (`24×2px`, `5px` gap) in a `44×44px` tap target.

App-form pages use a reduced header: height `76px` desktop / `60px` mobile, wordmark at 19px/17px,
and a single "Back to site" link at `rgba(255,255,255,0.60)`, 500 weight, **13.5px mobile /
14.5px desktop** — a real pair; an earlier revision of this document recorded only the
desktop value.

The wordmark has three sizes across the site, not two. The footer takes the app-header size,
so it is not a special case:

| Context | Square | Text | Gap |
| --- | --- | --- | --- |
| Site header, desktop | 13×13 | 21px | 12px |
| App header, desktop | 12×12 | 19px | 12px |
| Footer, desktop | 12×12 | 19px | 12px |
| Site header, mobile | 11×11 | 17px | 9px |
| App header, mobile | 11×11 | 17px | 10px |
| Footer, mobile | 11×11 | 17px | 10px |

The 9px site-header mobile gap is a one-pixel disagreement with the other two mobile
artboards. **Resolved to 10px everywhere.**

### Footer

`#151418`, top border `rgba(255,255,255,0.09)`, `64px 0 36px`. Four columns
`1.4fr 1fr 1fr 1.2fr` gap `40px`: brand + one-line description, Company links, More links,
Contact. Column headings are 11px/600 uppercase `rgba(255,255,255,0.38)` with `12px` between
links at 15px `rgba(255,255,255,0.66)`. The mobile artboard puts those headings at **11.5px**,
i.e. larger than desktop — the only role in the design that scales backwards, and almost
certainly a slip. **Resolved to a flat 11px.** A bottom bar sits `56px` below, separated by a `24px`
padded rule, holding the copyright at 14px `rgba(255,255,255,0.4)` and two legal links at
14px `rgba(255,255,255,0.5)`. Mobile stacks to two columns, gap `28px`, and moves the contact
block below a rule with the legal links above the copyright rather than beside it.

**Contact column content differs from the artboard as built.** The artboard shows
`hello@malameran.com` and a full street address (150 King Street West, Suite 200, Toronto,
Ontario M5H 1J9). The brief specifies `info@` and city/country only, which is what ships;
both are `TODO(copy):` in `src/content/nav.ts` pending the client's confirmation of the real
mailbox and address. There is no phone number and no social links anywhere in the design —
do not add placeholders for them.

### Buttons

| Variant | Fill | Label | Padding | Radius | Hover |
| --- | --- | --- | --- | --- | --- |
| Primary (hero/submit) | `--accent` | `#101010` 17px/700 | `19px 30px` | 14 | `accent 82%, #ffffff` |
| Primary (header) | `--accent` | `#101010` 15px/700 | `13px 22px` | 12 | same |
| Primary (step-nav) | `--accent` | `#101010` 15.5px/700 | `15px 28px` | 12 | same |
| Primary (inline retry) | `--accent` | `#101010` 15px/700 | `13px 22px` | 12 | — |
| Ghost on dark | transparent, `1px rgba(255,255,255,0.45)` | `#fff` 16px/600 | `16px 26px` | 12 | border `#fff`, fill `rgba(255,255,255,0.06)` |
| Secondary on light | transparent, `1px --line` | `--muted` 15.5px/600 | `14px 22px` | 12 | border `#A9A6A0` |
| Small destructive | transparent, `1px --line` | `--muted` 13.5px/600 | `7px 12px` | 8 | text `--err`, border `#E0BFB6` |
| Disabled / submitting | `accent 42%, #F4F3EF` | `rgba(16,16,16,0.55)` 17px/700 | `19px 30px` | 14 | `cursor: not-allowed` |
| Text link CTA | — | `rgba(255,255,255,0.72)` 16px/500, underlined, `text-underline-offset:4px`, decoration `rgba(255,255,255,0.3)` | — | — | text and decoration → `#fff` |

Submitting state carries a 17px spinner: `border: 2px solid rgba(16,16,16,0.25)` with
`border-top-color: rgba(16,16,16,0.7)`, `animation: mal-spin 0.8s linear infinite`.

Buttons stack full-width on mobile (`display:block; text-align:center`), primary first,
secondary below at `12–20px` gap.

### Cards

**On paper.** `background` inherited (transparent over `--paper`), `1px solid #E4E3DF`,
radius 20–22, padding per the table above. Optional leading numeral in Tight at 26/48/56/64px
`accent 88%, #101010`. Heading in Tight 20–26px/700. Body 15.5–16.5px `#5A5852` or `#3A3936`.
Some cards close with a `16px`-padded top rule (`1px #E4E3DF`) carrying a 15px `#6C6A66`
deliverable line.

**On dark.** `background: rgba(255,255,255,0.035)` (or `0.04`), `1px solid rgba(255,255,255,0.12)`,
radius 20–22. Heading `#fff`, body `rgba(255,255,255,0.66–0.72)`.

**Emphasised (buyer-owned).** `background: color-mix(accent 12%, #101010)`, border `var(--you)`
(= accent), plus a "You" pill: 11px/600 uppercase accent text, `1px color-mix(accent 60%, #101010)`,
radius 999, `5px 10px`.

**Sidebar (dark card on a light page).** `--dark-quiet`, `1px solid #2A292E`, radius 24,
padding `32px 30px 34px`, `position: sticky; top: 24px`. Accent uppercase eyebrow, then either
a numbered timeline (26px circular nodes, 1px `rgba(255,255,255,0.22)` ring, joined by a 1px
`rgba(255,255,255,0.16)` connector) or a list separated by `rgba(255,255,255,0.10)` rules.

**Statement card.** No fill, `1px solid rgba(255,255,255,0.22)`, radius 22 — used once per
grid as the closing "action" cell.

### Form fields

**Light (app forms — the canonical treatment).**
Label 14.5px/600 `#26251F`, `margin-bottom: 8px`. An optional field gets a sibling
`Optional` tag: 11.5px/500 uppercase `#918E88`, baseline-aligned, `8px` gap. An optional
description sits between label and control at 14px/1.5 `--muted`, `10px` below.
Control: `padding 14px 16px`, 16px text `--ink`, `background #fff`, `1px solid #D3D2CC`,
radius 12, `outline:none`. Placeholder `#A6A39D`.
Focus: `border-color: var(--accent)` + `box-shadow: 0 0 0 3px rgba(226,117,27,0.20)`.
Hint below: 13.5px `#918E88`, `8px` above.
Error: border `--err`, background `#FDF7F5`, and beneath it a `17px` circular `--err` badge
with a white `!` beside 14px/500/1.45 `--err` message text, `8px` gap, `10px` above.
Form-level error banner: `1px #E5C3BA` on `#FCF3F1`, radius 12–14, `12px 14px` / `18px 20px`,
heading 16.5px/700 `#7E2C1B`, body 15px `#6B3327`.
Locked/submitting: wrapper `opacity: 0.5; pointer-events: none`, input background `#F4F3EF`.

**Dark (marketing forms).** Label 14.5px/600 `rgba(255,255,255,0.9)`; required marked with an
accent `*`. Control `padding 15px 16px`, 16px `#fff`, background `rgba(255,255,255,0.045)`,
border `rgba(255,255,255,0.14)`, radius 12. Placeholder `rgba(255,255,255,0.32)`.
Focus: accent border. Field pairs sit in `1fr 1fr` gap `22px 24px`; single fields get
`margin-top: 22px`.

**Select.** Native element with `appearance: none`, right padding `42–44px`, and a CSS chevron:
a `8–9px` square with two 2px borders rotated 45°, absolutely positioned `right: 17–18px`.
Stroke `#8B8880` on light, `rgba(255,255,255,0.5)` on dark. Options on dark selects are forced
to `#111` so the native dropdown stays readable.

**Textarea.** Same as input plus `line-height: 1.5` and `resize: vertical` (`none` in the
error-state sample). Rows 4–6.

**Chips (multi-select).** Radius 999, `9px 15px` desktop / `10px 14px` mobile, wrapped in a
flex row with `10px` (`8px` mobile) gap.
Unselected: `#fff`, `1px #D3D2CC`, 14.5px/500 `#3A3833`; hover border `#A9A6A0`.
Selected: `color-mix(accent 22%, #ffffff)`, `1px var(--accent)`, 14.5px/600 `#101010`, label
suffixed with `✕`.
A free-text "add another" input follows at `12px` below with a **dashed** `#C9C7C0` border that
becomes solid accent on focus.

**Checkbox.** `20×20px`, radius 6, `1px rgba(255,255,255,0.28)`, `rgba(255,255,255,0.04)` fill,
`2px` top offset against 14.5px/1.5 label text, `12px` gap.

**File upload.** Dropzone: `1px dashed #C4C2BB`, radius 16, background `#FCFCFA`,
`32px 24px`, centred. Title 16.5px/600 `#26251F`; "or **browse your device**" at 14px `--muted`
with the action in accent/600/underlined; constraints line 13px `#918E88`
("PDF, images, DWG or spreadsheets · up to 10MB per file · 5 files maximum").
File row: `1px --line`, radius 12, `#fff`, `14px 16px` — name 14.5px/600 `#26251F` with
`text-overflow: ellipsis`, meta 13px `#918E88` ("2.4 MB · uploaded" / "· uploading 64%"),
Remove/Cancel button on the right, and a 3px progress track (`#EDECE8` with an accent fill)
`12px` below.
Rejected file: the dropzone repeats with a dashed `--err` border on `#FDF7F5`, heading
`#7E2C1B`, body `#6B3327`, and an accent "Choose a different file" link.

### Step progress (three-step form)

Three equal flex tracks, `10px` apart. Each is a 3px `radius:2px` bar over a `14px`-spaced row
holding a `22px` circular numeral pill and a 14.5px/600 label.

| Step state | Track | Pill fill | Pill text | Pill border | Label |
| --- | --- | --- | --- | --- | --- |
| Complete | accent | `color-mix(accent 20%, #ffffff)` | `#8A4408` | accent | `#6C6A66` |
| Current | accent | accent | `#101010` | accent | `#1A191E` |
| Upcoming | `#DEDDD8` | `#ffffff` | `#918E88` | `#D3D2CC` | `#6C6A66` |

A step carrying errors gains an issue pill beside the label: 11.5px/700 `--err`,
`1px #E5C3BA` on `#FCF3F1`, radius 999, `2px 8px`, reading `! 1 issue`.

Footer nav sits below a `26px`-padded `--line` rule: Back on the left, then the step counter
("Step 2 of 3", 14px `#918E88`) and the primary Continue/Review button `20px` apart on the right.
Back is disabled-looking at step 1 (`#B0ADA6`).

Mobile replaces the labelled tracks with three 3px bars at `6px` gap plus a row carrying the
current step name (15px/700 `--ink`) and "Step 1 of 3" (13.5px `#918E88`).

### Success page

Own frame, no site nav beyond the reduced header. Content capped at `760px`, padded
`96px 40px 104px`. Accent uppercase eyebrow → h2 at 50–52px → lead paragraph at 19px `#3A3833`
carrying a bold `--ink` reference code (`MAL-40219`, `SUP-11824`) → a white "What happens next"
card (`1px --line`, radius 20, `28px 30px`) whose rows pair a bold accent timeframe with a
plain description, separated by `#EDECE8` hairlines → a confirmation-email paragraph at 16px
`--muted` → an underlined "Return to the home page" link.

### Section eyebrow

The repeating opener above every section heading: 11–12.5px, weight 600, `letter-spacing: 0.06em`,
`text-transform: uppercase`, `margin-bottom: 20–26px`. Accent on dark grounds;
`color-mix(accent 74%, #101010)` on paper; `#8A8882` or `#918E88` when deliberately muted.

### Rules and dividers

A rule is a `1px`-tall filled div, never a `border` on its own element:
`#DDDCD8` between prose blocks on paper, `#E4E3DF` inside cards, `--line` on form pages,
`rgba(255,255,255,0.09–0.14)` on dark, `#EDECE8` inside success cards.

### Small marker

A recurring `9–10px` square with `border-radius: 2px` filled with the accent, used to flag a
summary line. Not an icon set — the design ships **no icons at all**; every glyph is CSS
(chevron, hamburger, arrowhead, spinner) or a text character (`✕`, `!`, `·`, `→`).

### Image slots

Two placeholders only, both optional and toggleable via a canvas prop:
Home "the problem" (`210px` desktop / `170px` mobile, radius 20/18) and About (`230px`,
radius 20), each capped at `460px` wide. No photography is specified anywhere else.

---

## Notes for implementation

The design system is implemented in `src/app/globals.css`. Tailwind v4 has no
`tailwind.config.ts` — configuration is CSS-first, in three parts:

| Part | Holds | Why there |
|---|---|---|
| `@theme static` | Colour, font-family, radius and breakpoint tokens | Generates utilities (`text-ink`, `rounded-12`) **and** emits every token as a CSS variable. `static` is deliberate: without it Tailwind tree-shakes tokens no utility references yet, which would empty out a design system defined ahead of the components that use it. |
| `:root` | The seven gradient grounds and `--paper-fade` | Layered multi-stop gradients are not a scale, so they must not become utilities. Kept as variables and applied through the `.ground-*` classes. |
| `:root`, second block | The six derived accent `color-mix()` expressions | Computed values, not a scale. Kept as expressions so changing `--color-accent` propagates. |
| `@layer components` | `.ground-*` classes and the 67 `.t-*` typography roles | Applied wholesale to an element; each role carries size, weight, line-height, letter-spacing and family together so a heading cannot be assembled wrongly. |
| `@utility` | `.focus-ring`, `.focus-ring-dark`, `.focus-outline` | Declared with `@utility`, not `@layer components`, because only utilities accept variants — components need `focus:focus-ring` on the field itself and `focus-visible:focus-outline` on links and buttons. |
| top level | `@keyframes mal-spin` | Tailwind does not manage keyframes. |

Other rules that survive from the extraction:

- Keep the `color-mix()` expressions as expressions so changing `--color-accent`
  propagates. Tailwind emits a static fallback plus an `@supports (color: color-mix(…))`
  block carrying the real expression; both are correct.
- The `box-shadow: inset 0 0 0 1px` + `background-clip: padding-box` pairing throughout the
  source is a canvas artefact. Use a normal `border`.
- The `#E4E3E0` page background and the `0 24px 60px rgba(0,0,0,0.16)` artboard shadow are
  canvas chrome, not site design. Neither is a token.
- Breakpoints are `md: 768px` and `lg: 1024px`. The source has none — the two artboards give
  the endpoints only. `lg` is where the 1440-authored sizes take effect, so an 82px hero
  applies from 1024px up; revisit when Home is built.

### Grounds: three `--dark-hero` variants

The source defines `--dark-hero` three times and `--dark-quiet` twice, with different values
under the same name. They are separate variables in the implementation:

| Variable | Glow | Paper-fade | Used by |
|---|---|---|---|
| `--dark-hero-home` | 15% | yes | Home hero |
| `--dark-hero` | 14% | yes | About, Services, Industries, For Suppliers, How It Works |
| `--dark-hero-form` | 13% | no | Contact |
| `--dark-soft` | 9% | yes | Alternating sections |
| `--dark-quiet` | — | no | Marketing quiet band |
| `--dark-quiet-form` | 10% | no | Form-page sidebar |
| `--dark-strong` | 20% | no | Final CTA band |

### Chrome typography roles

Section 2 above is content typography. The header, footer, buttons and links need fifteen
more roles, every value already listed in the type scale but not extracted into a class
until the components existed:

| Class             | Mobile            | Desktop | Used by                                     |
| ----------------- | ----------------- | ------- | ------------------------------------------- |
| `t-wordmark`      | 17 / 700 / +.10em | 21      | Site header                                 |
| `t-wordmark-md`   | 17 / 700 / +.10em | 19      | App header, footer                          |
| `t-nav`           | 15 / 500          | —       | Header nav link                             |
| `t-link-back`     | 13.5 / 500        | 14.5    | "Back to site"                              |
| `t-link-cta`      | 16 / 500          | —       | Text link CTA                               |
| `t-btn`           | 17 / 700          | —       | Hero and form submit                        |
| `t-btn-sm`        | 15 / 700          | —       | Header CTA, inline retry                    |
| `t-btn-step`      | 15.5 / 700        | —       | Step-nav Continue / Review                  |
| `t-btn-ghost`     | 16 / 600          | —       | Ghost on dark                               |
| `t-btn-secondary` | 15.5 / 600        | —       | Secondary on light                          |
| `t-btn-xs`        | 13.5 / 600        | —       | Remove / Cancel                             |
| `t-footer-link`   | 15 / 400          | —       | Footer link                                 |
| `t-footer-note`   | 15 / 1.55         | —       | Footer description, address                 |
| `t-legal`         | 14 / 400          | —       | Copyright, legal links                      |
| `t-eyebrow-xs`    | 11 / 600 / +.06em | —       | Footer heading, "You" pill, step-row opener |

Three are deliberately separate from a role they nearly duplicate:

- `t-footer-link` 15/none vs `t-fineprint` 15/1.5 — same size, different line-height, which
  changes every link's box height in a 12px-gap column.
- `t-btn-sm` 15/700 vs `t-nav` 15/500 — different weight.
- `t-eyebrow-xs` flat 11 vs `t-eyebrow` 11→12.5 and `t-eyebrow-sm` 11→11.5 — the footer
  heading and the "You" pill stay at 11px on both artboards, so neither pair fits.

The wordmark is written as two paired roles rather than three flat ones because a
`@layer components` class cannot take an `lg:` variant. The three sizes are unchanged.

### Page roles

Eight more, added when the Home page was built:

| Class | Mobile | Desktop | Used by | Nearest role, and why it is not that |
| --- | --- | --- | --- | --- |
| `t-node-body` | 14.5 / 1.45 | flat | Hero diagram node body | `t-label` is 14.5 but weight 600 |
| `t-diagram-title` | 17 / 700 / +.02em | 18 | The accent MALAMERAN card | nothing within 2px |
| `t-chip` | 13 / 500 | 13.5 | Diagram capability chips | nothing within 2px |
| `t-statement` | 18 / 500 / 1.45 | 20 | Trust card statement | nothing within 2px |
| `t-panel-body` | 17 / 1.6 | 18 | Centred panel paragraph | `t-prose` is the same pair at 1.65 |
| `t-marker-line` | 17 / 1.5 | 19 | Line beside an accent marker | `t-lead` is the same pair at 1.55 |
| `t-card-note` | 15.5 / 1.55 | 16 | Statement-cell body | `t-body-sm` is the same value but flat |
| `t-btn-panel` | 16 / 700 | 15 | CTA label inside a card | between `t-btn` and `t-btn-sm`; larger on mobile |

The last three follow the `t-body` / `t-body-lg` precedent: identical size pair,
different line-height, kept apart.

Four more, added for How It Works, Services and Industries. All flat — none of those
three pages has a 375px artboard:

| Class | Value | Used by | Nearest role, and why it is not that |
| --- | --- | --- | --- |
| `t-prose-step` | 17.5 / 1.6 | Step-row and sector-row body | `t-prose` is 17→18 at 1.65 |
| `t-body-panel` | 16 / 1.6 | Engagement-model card body | `t-body` is the same size at 1.5 |
| `t-stat-value` | 15.5 / 600 | Timeline value | `t-body-sm` is the same size at 400 |
| `t-fineprint-sm` | 14.5 / 1.5 | Timeline footnote | `t-node-body` is the same size at 1.45 |

`t-prose-step` was already in the type scale above as "Body (step / industry copy)";
it simply had no class until the pages using it were built.

Four more, added for For Suppliers, About and Contact. Also flat:

| Class | Value | Used by | Nearest role, and why it is not that |
| --- | --- | --- | --- |
| `t-h2-why` | 52 / 1.03 / −0.03 / 800 | About "Why we exist" | `t-h2-success-request` is 52/1.03 at −0.035em |
| `t-h2-cta-supplier` | 56 / 1.02 / −0.035 / 800 | For Suppliers closing band | `t-h2-section` is 56 at 1.03 / −0.03em |
| `t-contact-value` | 17 / 600 | Contact email address | nothing within 2px at that weight |
| `t-stat-figure` | 44 / 700 / lh 1 / −0.035 | Contact "2 days" | `t-h2-statement` is 44/700 at line-height 1.08 |

`t-h2-why` and `t-stat-figure` were both already in the type scale ("Why-we-exist h2",
"Stat figure") without a class.

### Type roles with no mobile counterpart

Mobile artboards exist for only 4 of the 12 pages, so 19 of the 36 content roles have a
single size read from a desktop artboard and **do not scale yet**. They carry no breakpoint override.
When the pages using them are built and checked at 375px, these are the ones that need a
mobile value decided:

`t-h1-page` 68 · `t-h1-contact` 64 · `t-h2-cta-page` 72 · `t-h2-statement` 44 ·
`t-h2-industry` 38 · `t-h2-step` 34 · `t-h2-form-card` 30 · `t-h2-success-request` 52 ·
`t-h2-success-apply` 50 · `t-h3-card-lg` 26 · `t-h3-process` 22 · `t-numeral-row` 64 ·
`t-numeral-criteria` 56 · `t-numeral-service` 26 · `t-body-lg` 16.5 · `t-body` 16 ·
`t-body-sm` 15.5 · `t-fineprint` 15 · `t-label` 14.5

The last five are single-size because the source gives them the *same* value on both
artboards — those are settled, not gaps. The other fourteen are genuine gaps.

The remaining 17 content roles have a real 375 ↔ 1440 pair and change at `lg`. Of the
fifteen chrome roles, three are pairs and twelve are single-size.

### Folds applied

Two near-duplicate source values were collapsed. Both are recorded because each moves a real
value; reverse either by splitting the class:

| Fold | Delta |
|---|---|
| Engagement-model h3 28px → `t-h3-card-lg` 26px | −2px; weight and line-height unchanged |
| Home "the problem" h2 line-height 1.02 → `t-h2-section` 1.03 | +0.01 lh on a 56px heading; mobile counterpart identical (36/1.05) |

Everything else that looked foldable was kept separate, because the size delta hid a change
of weight or line-height: `t-numeral-step` (800/lh 1) vs `t-numeral-trust` (800/lh 0.9) vs
`t-numeral-row` (700/lh 0.9), all at 64px desktop; `t-numeral-tile` (26/800) vs
`t-numeral-service` (26/700); `t-h3-card` (−.015em) vs `t-h3-industry` (−.02em), two separate
real pairs.

## Authored, not in the source

Two things the site cannot ship without and the artboards do not contain. Both stay inside
the existing tokens — no new colour, radius or type size. If the design goes back to the
client, these are the parts with nothing behind them.

**Mobile navigation panel.** The header artboard gives a two-bar hamburger and no open
state.

- Full-screen panel on `--dark-quiet`, fixed below the 64px header bar, which stays visible
- The two hamburger bars rotate ±45° into an ✕ — CSS geometry, consistent with the design's
  zero-icon rule
- The six nav links at `t-h3-card` (21px on mobile), stacked, separated by
  `rgba(255,255,255,0.09)` rules, 20px vertical padding each. Active `#fff`, rest
  `rgba(255,255,255,0.72)` — the desktop nav's own colours
- The primary CTA full-width, 24px below the list, per the source's mobile button rule
- Escape closes it, Tab cycles inside it, focus returns to the hamburger, the page behind it
  does not scroll

**Mobile layout for How It Works, Services and Industries.** None of the three has a
375px artboard. Nothing new was invented; every rule below is one the Home artboards
already set:

| Desktop | Below `lg` |
| --- | --- |
| Any multi-column card grid | one column, gap 12 |
| Card padding | `22px` |
| Card radius | two steps down (22→20, 20→18) |
| Section head bottom margin 52–56 | 28–32 |
| Page hero `1fr 420px` gap 80 | stacked, gap 40, aside below the lead |
| Step row `120px 1fr 1fr` gap 48, padding 44 | stacked, gap 24, padding 32; numeral above the heading, point list below the copy |
| Sector row `1fr 1fr` gap 72, padding 48 | stacked, gap 24, padding 32; the chip grid stays two columns, because the chips are short and one column leaves the row very tall |
| CTA heading 72px | unchanged — `t-h2-cta-page` is one of the roles with no mobile value, and stays flat until an artboard gives one |

**Legal pages and the 404.** The artboards have no legal or error screens. All three
are composed from existing pieces rather than a new visual language:

- `PageHero` for the heading; a `paper` section for the body; measure capped at 720px
- Section headings use `t-h3-card-lg` (26px) — `t-h2-step` at 34px is too heavy for a
  document with a dozen sections
- Body copy is `t-prose`, the long-form role
- Bullet lists render as `Marker size={9}` + text rows. The design ships no bullet
  glyph, and marker-plus-text is already an established pattern; a `list-disc` would
  introduce a shape the design does not have
- The template notice uses the info-panel treatment from the form pages —
  `Card tone="info"`, `--line` on `--surface-info`, radius 14, padding `16px 18px`
- Neither legal page closes on a CTA band, the same exception Contact is
- The 404 is a single `hero` band: eyebrow, `t-h1-page`, one line of copy, one primary
  button. It is composed inline rather than through `PageHero`, which has no CTA slot

**Mobile layout for For Suppliers, About and Contact.** Same position as the three pages
above — no 375px artboard — and the same patterns:

| Desktop | Below `lg` |
| --- | --- |
| Any card grid | one column, gap 12 |
| Card padding / radius | `22px`, two radius steps down |
| Criteria card, numeral beside the copy at gap 26 | numeral above the heading, as Home's trust cards |
| About `1fr 520px` gap 96 | stacked, as Home's "the problem" |
| For Suppliers three-up process row | one column, gap 24 |
| Contact `1fr 420px` gap 64 | stacked, form first, the three aside cards below |
| Contact field pairs `1fr 1fr` gap 22/24 | one column, gap 22 |
| Contact form card `44px 44px 48px` | `22px` |

**Keyboard focus for links and buttons.** The source has a focus state for form fields only
(`.focus-ring`, `.focus-ring-dark`). `.focus-outline` is a 2px accent outline at 2px offset,
applied as `focus-visible:focus-outline`. An outline rather than a box-shadow so it reads on
both the paper and the dark grounds.

## How It Works, Services, Industries: notes from the build

None of these three has a 375px artboard, so all of their mobile behaviour is authored —
see "Authored, not in the source".

Where the artboards did not match this document:

| Element | Artboard | This document said | Resolution |
| --- | --- | --- | --- |
| Commitment card h3 (How It Works) | 23px at −0.02em | step card h3 is 23/−0.015; industry card h3 is 24/−0.02 | `t-h3-card` (23 at −0.015); tracking only |
| Timeline row rules | `rgba(255,255,255,0.10)` | 0.10 is listed as a header/footer edge, not an in-card divider | `Rule tone="dark"` (0.12) |
| Engagement card inner rule | `rgba(255,255,255,0.14)` | 0.14 is listed as a card *border*, not a divider | `Rule tone="dark"` (0.12) |
| Timeline aside border | `rgba(255,255,255,0.14)` | undifferentiated from the hero panel's 0.13 | kept apart: `Card tone="dark-panel"` is 0.14, the hero diagram stays 0.13 |
| "Not on the list" eyebrow | 12px | `t-eyebrow` is 11 → 12.5 | the same 0.5px fold already taken on Home's suppliers panel |

First real use of two tokens declared in block 1 and unused until now:
`--color-numeral-idle` (`#B9B7B1`) on the three steps Malameran owns, and
`--color-text-eyebrow` (`#8A8882`) on their "Us" labels.

## For Suppliers, About, Contact: notes from the build

None of these three has a 375px artboard either.

| Element | Artboard | This document said | Resolution |
| --- | --- | --- | --- |
| Contact closing band | none — the page ends on the form | every marketing page ends on `--dark-strong` | followed the artboard; the section-rhythm note above now records the exception |
| For Suppliers closing band | 56px heading, ghost `mailto:` button, `112px 0 124px` | the rhythm is recorded; a 56px CTA heading is not | its own section and the new `t-h2-cta-supplier`; `FinalCtaBand` is untouched |
| For Suppliers application band | `112px 0 112px` | standard is `112px 0 120px` | folded to `standard`; 8px at the bottom |
| Contact form band | `56px` top, `112px` bottom | no matching entry | new `form-band` rhythm |
| Dark card fills | 0.02 on both form cards, 0.03 on the Contact sidebar cards | four fills listed, "faintest to lightest use order" | real tones — `dark-form` and `dark-aside`. Only the 0.04 → 0.035 fold from block 3 stands |
| Email and office card rules | `rgba(255,255,255,0.10)` | listed as a header/footer edge | `Rule tone="dark"` (0.12), as in 4a |
| Contact office hours line | 15 / 1.55 | `t-fineprint` is 15 / 1.5 | folded; a one-line footnote |
| Contact email label | 14.5, no line-height | `t-node-body` is 14.5 / 1.45 | folded; single line |
| Contact hero lead | `margin-top: 26px` | every other page uses 28 | folded to 28 |

This block is the first real use of the **dark field treatment** and of `.focus-ring-dark`,
both declared in block 1 and unused until now. Both render as documented: a 4.5% white
fill inside a 14% white border at radius 12, placeholder at 32%, and an accent border on
focus with no ring.

## Home page: where the artboards disagree

Recorded when the page was built, so the next page does not re-discover them.

| Element | Desktop 1440 | Mobile 375 | Resolution |
| --- | --- | --- | --- |
| "You" / "Us" pill | 11px | **11.5px** | flat 11 (`t-eyebrow-xs`) — the same backwards scaling as the footer column heading |
| Hero diagram node eyebrow | 11.5px | 11.5px | `t-eyebrow-sm` (11 → 11.5); mobile loses 0.5px |
| For-suppliers eyebrow | 12px | 11px | `t-eyebrow` (11 → 12.5); desktop gains 0.5px |
| Hero diagram node title | 20px, no tracking | 19px | `t-h3-card-sm`, which adds −0.012em at `lg` |
| Dark card fill | 0.04 on step cards | 0.035 elsewhere | folded to 0.035 |
| Statement-cell link | 15px / white 70% | same | `t-link-cta` (16 / white 72%) |
| Statement-cell CTA | 15/700, `14px 22px` | 16/700, `17px 22px` | `primary-panel`, a real pair |
| How-it-works band | `112px 0 120px` | `64px 20px 72px` | `standard` rhythm; mobile loses 8px of bottom padding |
| Industry card grid | gap **16** | — | Home only. The Industries *page* uses gap 20 for the same card |
| Hero band | closes with a 10% white hairline | none | `<Section divider>`, desktop and mobile both |

Everything else matched between the two artboards.

## Open questions

- ~~**Two supplier application surfaces.**~~ **Resolved 2026-09-05:** the embedded dark form
  on For Suppliers is dropped; `/suppliers/apply` wins. See `docs/decisions.md`.
- ~~**Dark form treatment scope.**~~ **Resolved by the above:** Contact is the only dark form
  on the site. Its fields are the only implementation of the dark treatment.
