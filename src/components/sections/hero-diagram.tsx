import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME } from "@/content/home";

/**
 * The hero handoff diagram.
 *
 * CSS only — no icons, images or SVG, matching the source. The panel and its
 * nodes carry border opacities and paddings that belong to nothing else on the
 * site, so this does not go through <Card>.
 *
 * Same vertical stack at every width; only the size steps change.
 */

const { diagram } = HOME;

/** A 1px accent line closed by a pure-CSS triangle. */
function Connector() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center py-2.5 lg:py-3"
    >
      <div className="h-[22px] w-px bg-(--accent-connector) lg:h-7" />
      <div className="border-t-accent size-0 border-x-5 border-t-7 border-x-transparent lg:border-x-6 lg:border-t-8" />
    </div>
  );
}

function Node({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-16 lg:rounded-18 border border-white/18 bg-white/3 p-4.5 lg:px-5.5 lg:py-5">
      <Eyebrow tone="dark-42" size="card">
        {eyebrow}
      </Eyebrow>
      <p className="t-h3-card-sm mt-2 text-white lg:mt-2.5">{title}</p>
      <p className="t-node-body mt-1.5 text-white/62">{body}</p>
    </div>
  );
}

export function HeroDiagram() {
  return (
    <div className="rounded-24 lg:rounded-28 border border-white/13 bg-white/[3.5%] p-5 lg:p-6.5">
      <Eyebrow tone="dark-45" size="card" className="mb-4 lg:mb-5">
        {diagram.eyebrow}
      </Eyebrow>

      <Node {...diagram.from} />
      <Connector />

      <div className="rounded-16 lg:rounded-18 border border-(--accent-tint-border) bg-(--accent-diagram-fill) px-5 pt-6.5 pb-6 lg:px-6 lg:pt-7.5 lg:pb-7">
        <p className="t-diagram-title text-accent">{diagram.middle.title}</p>
        <ul className="mt-3.5 flex flex-wrap gap-[7px] lg:mt-4 lg:gap-2">
          {diagram.middle.chips.map((chip) => (
            <li
              key={chip}
              className="t-chip rounded-pill border border-white/18 px-[11px] py-[5px] text-white/90 lg:px-3 lg:py-1.5"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <Connector />
      <Node {...diagram.to} />
    </div>
  );
}
