import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import type { Project } from "../content/types";
import { featured, rest, explorations } from "../lib/projects";
import { motion } from "../lib/motion";
import { startProject } from "../lib/contact";
import { mailto } from "../lib/mailto";
import { Button } from "../components/Button";
import { SectionHeading } from "../components/SectionHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);
const pad2 = (n: number) => String(n).padStart(2, "0");
type Open = (slug: string) => void;

type RowProps = { p: Project; n: number; armed: boolean; onOpen: Open; onArm: (slug: string | null) => void; onHover: (src: string | null) => void; small?: boolean };

/** One project: number, name, discipline, year, one line. Hover or focus floods the row in the project's colour and shows its preview; on touch the first tap shows it and the second opens. */
function Row({ p, n, armed, onOpen, onArm, onHover, small }: RowProps) {
  const touch = () => matchMedia("(hover: none)").matches;
  return (
    <li>
      <a className={`wk-row${p.featured ? " feat" : ""}${small ? " small" : ""}${armed ? " armed" : ""}`} href={`#work/${p.slug}`} data-cursor="open"
        style={{ "--oc": p.color, "--oi": p.ink } as React.CSSProperties}
        onClick={(e) => { e.preventDefault(); if (touch() && !armed) onArm(p.slug); else onOpen(p.slug); }}
        onPointerEnter={() => onHover(p.media.poster)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(p.media.poster)} onBlur={() => onHover(null)}>
        <span className="wk-n">{pad2(n)}</span>
        <b className="wk-name">{p.name}</b>
        <span className="wk-meta"><span>{p.type}</span><span>{p.year}</span>{p.client && <span>{p.client}</span>}{p.tag && <em className="tag">{p.tag}</em>}</span>
        <span className="wk-line">{p.result ?? p.line}</span>
        <span className="wk-peek" aria-hidden="true"><img src={p.media.poster} alt="" width={960} height={540} loading="lazy" /></span>
      </a>
    </li>
  );
}

/** Every project in one numbered list, the old featured ones first and the side projects last. Ends with a way to hire. */
export function Work({ onOpen, ready }: { onOpen: Open; ready: boolean }) {
  const preview = useRef<HTMLImageElement>(null), root = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState<string | null>(null);
  const main = [...featured, ...rest];

  // Rows come up as they arrive: the name rises letter by letter inside its mask, the rest of the row fades up.
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".wk-row");
      const splits = rows.map((r) => SplitText.create(r.querySelector(".wk-name")!, { type: "words,chars", mask: "chars", wordsClass: "word", charsClass: "ch" }));
      rows.forEach((r, i) => {
        gsap.set(splits[i].chars, { yPercent: 115 });
        gsap.set(r.querySelectorAll(".wk-n, .wk-meta, .wk-line"), { autoAlpha: 0, y: 14 });
        ScrollTrigger.create({ trigger: r, start: "top 88%", once: true, onEnter: () => {
          gsap.to(splits[i].chars, { yPercent: 0, duration: motion.sceneName, stagger: motion.sceneStagger, ease: motion.easeOut });
          gsap.to(r.querySelectorAll(".wk-n, .wk-meta, .wk-line"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, delay: 0.15, ease: motion.easeSoft });
        } });
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => splits.forEach((s) => s.revert());
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // The preview follows the pointer with a little lag and leans into the move.
  useEffect(() => {
    const img = preview.current!;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => { cx += (x - cx) * 0.14; cy += (y - cy) * 0.14; img.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) rotate(${(x - cx) * 0.04}deg)`; raf = requestAnimationFrame(loop); };
    addEventListener("pointermove", move); raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  const onHover = (src: string | null) => { const img = preview.current!; if (src) img.src = src; img.classList.toggle("on", !!src); };

  const row = (p: Project, n: number, small?: boolean) => <Row key={p.slug} p={p} n={n} armed={armed === p.slug} onOpen={onOpen} onArm={setArmed} onHover={onHover} small={small} />;
  return (
    <>
      <section ref={root} className="work" id="work" aria-labelledby="work-h" data-paint="var(--black)" data-ink="var(--paper)">
        <SectionHeading id="work-h">{site.work.heading}</SectionHeading>
        <ul>{main.map((p, i) => row(p, i + 1))}</ul>
        {explorations.length > 0 && <>
          <h3 className="side-h">{site.work.sideHeading}</h3>
          <ul>{explorations.map((p, i) => row(p, main.length + i + 1, true))}</ul>
        </>}
        <div className="wk-cta">
          <p>{site.work.hire}</p>
          <Button href={mailto} onClick={startProject} data-cursor="write">{site.nav.cta}</Button>
        </div>
      </section>
      <img className="preview" ref={preview} alt="" aria-hidden="true" />
    </>
  );
}
