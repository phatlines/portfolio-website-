import { useState, type CSSProperties } from "react";
import { site } from "../content/site";
import { featured } from "../lib/projects";

/** Real work in the hero: the featured projects as glass folders peeking up from the bottom edge. Hover opens one; on touch the first tap opens it and the second opens the project. */
export function HeroPeek({ onOpen }: { onOpen: (slug: string) => void }) {
  const [armed, setArmed] = useState<string | null>(null);
  return (
    <ul className="hero-peek" aria-label={site.hero.peekLabel} onMouseLeave={() => setArmed(null)}>
      {featured.slice(0, 3).map((p) => {
        const f = p.folder ?? { color: p.color, ink: p.ink };
        return (
          <li key={p.slug}>
            <a
              className={`peek${armed === p.slug ? " open" : ""}`}
              style={{ "--fc": f.color, "--fi": f.ink } as CSSProperties}
              href={`#work/${p.slug}`}
              onClick={(e) => {
                e.preventDefault();
                if (matchMedia("(hover: none)").matches && armed !== p.slug) setArmed(p.slug);
                else onOpen(p.slug);
              }}
              data-cursor="open"
              aria-label={`${site.hero.open} ${p.name}`}
            >
              <i className="pk-back" aria-hidden="true" />
              <i className="pk-sheet" aria-hidden="true" />
              <img className="pk-card" src={p.media.poster} alt="" width={960} height={540} decoding="async" />
              <span className="pk-front" aria-hidden="true">{p.name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
