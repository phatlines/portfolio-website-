import { site } from "../content/site";
import { featured } from "../lib/projects";

/** Real work in the hero: the featured projects as windows peeking up from the bottom edge. Rectangles on wide screens, squares on phones (CSS). */
export function HeroPeek({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <ul className="hero-peek" aria-label={site.hero.peekLabel}>
      {featured.slice(0, 3).map((p) => (
        <li key={p.slug}>
          <a className="peek" href={`#work/${p.slug}`} onClick={(e) => { e.preventDefault(); onOpen(p.slug); }} data-cursor="open" aria-label={`${site.hero.open} ${p.name}`}>
            <img src={p.media.poster} alt="" width={960} height={540} decoding="async" />
            <span aria-hidden="true">{p.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
