import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import type { MockNote } from "@/content/mock/projects";
import { INTERNAL_NOTES } from "@/content/panel";

/**
 * Notes the team writes about a record, on the form pages' info panel.
 *
 * AUTHORED: see "Admin panel screens" in docs/design.md. The heading names who
 * CANNOT see this rather than who can — on a screen the team shares with
 * nobody, the boundary is the useful fact.
 *
 * THERE IS NO BOX TO ADD A NOTE IN, not even a disabled one. Nothing on these
 * screens persists, and a disabled input still advertises that typing into it
 * will work. The block closes on a line saying where notes will be written
 * instead. Same rule as the profile with no Save button and the panel header
 * that greets nobody.
 */
export function InternalNotes({ notes }: { notes: readonly MockNote[] }) {
  return (
    <Card tone="info" pad="16-18" padLg="22" radius={14}>
      <Eyebrow tone="muted-paper" size="card">
        {INTERNAL_NOTES.heading}
      </Eyebrow>

      {notes.length === 0 ? (
        <p className="t-body-sm text-muted mt-3">{INTERNAL_NOTES.empty}</p>
      ) : (
        <div className="mt-4">
          {notes.map((note, index) => (
            <Fragment key={`${note.author}-${note.date}-${index}`}>
              {index > 0 ? <Rule tone="form" className="my-4" /> : null}
              <article>
                <p className="t-fineprint-sm text-text-small">
                  {note.author} · {note.date}
                </p>
                <p className="t-body-sm text-text-body-alt mt-1.5">
                  {note.body}
                </p>
              </article>
            </Fragment>
          ))}
        </div>
      )}

      <Rule tone="form" className="mt-4" />
      <p className="t-fineprint-sm text-text-small pt-3">
        {INTERNAL_NOTES.footnote}
      </p>
    </Card>
  );
}
