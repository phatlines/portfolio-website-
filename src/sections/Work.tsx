import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../content/site";
import type { Project } from "../content/types";
import { reel, featured, rest, explorations, findProject } from "../lib/projects";
import { searchProjects } from "../lib/search";
import { motion, reduceMotion } from "../lib/motion";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { Button } from "../components/Button";
import { Device } from "../components/Device";
import { Folder } from "../components/Folder";
import { ArrowOut } from "../components/Icons";

gsap.registerPlugin(ScrollTrigger);
type Open = (slug: string) => void;

/** One featured project, large in its device, with what it is, my role, its stack and its links. */
function Feature({ p, flip, onOpen }: { p: Project; flip: boolean; onOpen: Open }) {
  return (
    <article className={`feat${flip ? " flip" : ""}`} aria-labelledby={`f-${p.slug}`}>
      <a className={`feat-stage do-clip dev-on-${p.screen!.frame}`} href={`#work/${p.slug}`} onClick={(e) => { e.preventDefault(); onOpen(p.slug); }} aria-label={`${site.work.open} ${p.name}`} tabIndex={-1}>
        <Device p={p} />
      </a>
      <div className="feat-spec">
        <span className="tag">{p.type} · {p.year}</span>
        <h3 className="feat-name" id={`f-${p.slug}`}>{p.name}</h3>
        <p className="feat-line">{p.result ?? p.line}</p>
        <dl className="feat-dl">
          <dt>{site.work.role}</dt><dd>{p.role}</dd>
          <dt>{site.work.stack}</dt><dd>{p.stack.join(", ")}</dd>
        </dl>
        <div className="feat-acts">
          <Button variant="secondary" href={`#work/${p.slug}`} onClick={(e) => { e.preventDefault(); onOpen(p.slug); }}>{site.work.view}</Button>
          {p.liveUrl && <a className="btn btn-link" href={p.liveUrl} target="_blank" rel="noreferrer">{site.work.live}<ArrowOut /></a>}
        </div>
      </div>
    </article>
  );
}

/**
 * Selected Work: three live products on a stage, a finder, one large project per platform, then the rest as folders.
 * The finder filters both lists at once; nonsense shows everything with a note.
 */
export function Work({ onOpen }: { onOpen: Open }) {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [armed, setArmed] = useState<string | null>(null);
  const hits = useMemo(() => (query.trim() ? searchProjects(query) : reel), [query]);
  const none = query.trim() !== "" && hits.length === 0;
  const keep = (p: Project) => none || hits.includes(p);
  const shownFeatured = featured.filter(keep);
  const shownMore = [...rest, ...explorations].filter(keep);
  const stage = ["invoicely", "fitty", "kapture"].map(findProject).filter((p): p is Project => !!p?.screen);

  // Devices rise into place, spec columns follow; SPORI's full page scrolls inside its browser as you scroll past it.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".stage .dev", { y: 48, autoAlpha: 0, duration: motion.device, stagger: motion.deviceStagger, ease: motion.easeOut, scrollTrigger: { trigger: ".stage", start: "top 85%", once: true } });
      gsap.utils.toArray<HTMLElement>(".feat").forEach((f) => {
        gsap.from(f.querySelector(".dev"), { y: 32, autoAlpha: 0, duration: 0.8, ease: motion.easeOut, scrollTrigger: { trigger: f, start: "top 80%", once: true } });
        gsap.from(f.querySelectorAll(".feat-spec > *"), { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.05, delay: 0.1, ease: motion.easeSoft, scrollTrigger: { trigger: f, start: "top 80%", once: true } });
        const tall = f.querySelector<HTMLElement>(".dev-tall img");
        if (tall) gsap.to(tall, { y: () => -(tall.offsetHeight - tall.parentElement!.offsetHeight), ease: "none", scrollTrigger: { trigger: f, start: "top 70%", end: "bottom 20%", scrub: 0.6, invalidateOnRefresh: true } });
      });
      gsap.from(".fd-item", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.06, ease: motion.easeSoft, scrollTrigger: { trigger: ".folders", start: "top 85%", once: true } });
    }, root);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <section className="work section" id="work" ref={root} aria-labelledby="work-h">
      <div className="sec-head">
        <h2 className="sec-h" id="work-h">{site.work.heading}</h2>
        <span className="sec-note">{site.work.count}</span>
      </div>

      <div className="stage" aria-hidden="true">
        {stage.map((p) => <Device key={p.slug} p={p} className={`st-${p.slug}`} />)}
      </div>

      <div className="finder">
        <label className="sr-only" htmlFor="finder-q">{site.work.question}</label>
        <input id="finder-q" type="search" value={query} placeholder={site.work.question} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        <div className="chips" role="group" aria-label={site.work.question}>
          <button type="button" className="chip" aria-pressed={!query} onClick={() => setQuery("")}>{site.work.all}</button>
          {site.work.chips.map((c) => <button key={c.query} type="button" className="chip" aria-pressed={query === c.query} onClick={() => setQuery(query === c.query ? "" : c.query)}>{c.label}</button>)}
        </div>
      </div>
      <p className="finder-none" role="status">{none ? site.work.noMatch : ""}</p>

      <div className="feats">{shownFeatured.map((p, i) => <Feature key={p.slug} p={p} flip={i % 2 === 1} onOpen={onOpen} />)}</div>

      {shownMore.length > 0 && <>
        <h3 className="sub-h">{site.work.moreHeading}</h3>
        <ul className="folders">
          {shownMore.map((p) => <Folder key={p.slug} p={p} side={p.group === "exploration"} armed={armed === p.slug} onArm={setArmed} onOpen={onOpen} />)}
        </ul>
      </>}

      <div className="hire">
        <p>{site.work.hire}</p>
        <Button href={mailto} onClick={startProject}>{site.nav.cta}</Button>
      </div>
    </section>
  );
}
