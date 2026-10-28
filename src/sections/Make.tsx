import { site } from "../content/site";
import { findProject } from "../lib/projects";
import { SectionHeading } from "../components/SectionHeading";
import { LoopClip } from "../components/LoopClip";

/** Three offers as full-width rows, each with a clip of the project it points to. Hover floods the row in that project's colour. */
export function Make({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section className="make" id="make" aria-labelledby="make-h" data-paint="var(--black)" data-ink="var(--paper)">
      <SectionHeading id="make-h">{site.make.heading}</SectionHeading>
      <p className="make-intro">{site.make.intro}</p>
      <ul className="offers">
        {site.make.offers.map((o) => {
          const p = findProject(o.example);
          return (
            <li key={o.title} className="offer" style={p ? ({ "--oc": p.color, "--oi": p.ink } as React.CSSProperties) : undefined}>
              <h3>{o.title}</h3>
              <div className="offer-text">
                <p>{o.line}</p>
                {p && <a href={`#work/${p.slug}`} onClick={(e) => { e.preventDefault(); onOpen(p.slug); }} data-cursor="open">{o.exampleLabel}</a>}
              </div>
              {p && <div className="offer-clip" aria-hidden="true"><LoopClip media={o.clip ?? { ...p.media, src: p.media.kind === "video" ? p.media.src : p.media.poster }} /></div>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
