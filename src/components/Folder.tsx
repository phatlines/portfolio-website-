import type { CSSProperties } from "react";
import type { Project } from "../content/types";
import { site } from "../content/site";

type Props = { p: Project; armed: boolean; onArm: (slug: string | null) => void; onOpen: (slug: string) => void; side?: boolean };

/**
 * A project as a folder in its own colour. Hover or focus swings the cover open and the screenshot slides out and tips towards you.
 * On touch the first tap opens the folder, the second opens the project.
 */
export function Folder({ p, armed, onArm, onOpen, side }: Props) {
  const style = { "--fc": p.folder?.color ?? p.color, "--fi": p.folder?.ink ?? p.ink } as CSSProperties;
  const touch = () => matchMedia("(hover: none)").matches;
  return (
    <li className="fd-item">
      <a className={`folder${armed ? " armed" : ""}`} href={`#work/${p.slug}`} style={style} aria-label={`${site.work.open} ${p.name}`}
        onClick={(e) => { e.preventDefault(); if (touch() && !armed) onArm(p.slug); else onOpen(p.slug); }}
        onBlur={() => armed && onArm(null)}>
        <span className="fd" aria-hidden="true">
          <span className="fd-back" />
          <span className="fd-shot"><img src={p.media.poster} alt="" width={960} height={540} loading="lazy" /></span>
          <span className="fd-front"><b>{p.name}</b><small>{p.type}</small></span>
        </span>
      </a>
      <p className="fd-cap">{side && <span className="fd-side">{site.work.sideHeading}</span>}<b>{p.name}</b> {p.line}</p>
    </li>
  );
}
