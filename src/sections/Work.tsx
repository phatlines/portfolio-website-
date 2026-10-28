import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import type { Project } from "../content/types";
import { featured, rest, explorations } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { LoopClip } from "../components/LoopClip";
import { SectionHeading } from "../components/SectionHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);
const pad2 = (n: number) => String(n).padStart(2, "0");
type Open = (slug: string) => void;
const click = (open: Open, slug: string) => (e: React.MouseEvent) => { e.preventDefault(); open(slug); };

function Scene({ p, n, onOpen }: { p: Project; n: number; onOpen: Open }) {
  return (
    <article className="scene" data-paint={p.color} data-ink={p.ink} aria-labelledby={`n-${p.slug}`} style={{ "--sc": p.color, "--si": p.ink } as React.CSSProperties}>
      <span className="scene-dim" aria-hidden="true" />
      <p className="scene-meta"><span>{site.work.sceneLabel} {pad2(n)}</span><span>{p.type}</span></p>
      <h3 className="scene-name" id={`n-${p.slug}`} style={{ "--len": p.name.length } as React.CSSProperties}>{p.name}</h3>
      <a className="scene-media" href={`#work/${p.slug}`} onClick={click(onOpen, p.slug)} data-cursor="open" aria-label={`Open ${p.name}`}>
        <LoopClip media={p.media} />
      </a>
      <p className="scene-line">{p.line}</p>
    </article>
  );
}

function Row({ p, onOpen, onHover, small }: { p: Project; onOpen: Open; onHover: (src: string | null) => void; small?: boolean }) {
  return (
    <li>
      <a className={`index-row${small ? " small" : ""}`} href={`#work/${p.slug}`} onClick={click(onOpen, p.slug)} data-cursor="open"
        onPointerEnter={() => onHover(p.media.poster)} onPointerLeave={() => onHover(null)}>
        <b>{p.name}</b>
        <span className="index-type">{p.type}{p.tag && <em className="tag">{p.tag}</em>}</span>
        <span className="index-line">{p.line}</span>
      </a>
    </li>
  );
}

/** The featured projects as full-colour scenes, then the rest of the reel as a list with a preview that follows the cursor. */
export function Work({ onOpen, ready }: { onOpen: Open; ready: boolean }) {
  const preview = useRef<HTMLImageElement>(null);

  // Scenes stack like cards: each one slides over the last with an arched top edge that flattens as it arrives,
  // while the one underneath shrinks and dims. The clip tilts with scroll speed, and the big name arrives slower than the clip.
  useLayoutEffect(() => {
    if (!ready || reduceMotion()) return;
    const lenis = getLenis();
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".scene");
      scenes.forEach((sc, k) => {
        const name = sc.querySelector<HTMLElement>(".scene-name")!, media = sc.querySelector<HTMLElement>(".scene-media")!, next = scenes[k + 1];
        const split = SplitText.create(name, { type: "words,chars", mask: "chars", wordsClass: "word", charsClass: "ch" });
        gsap.from(split.chars, { yPercent: 115, rotate: 10, stagger: motion.sceneStagger, duration: motion.sceneName, ease: motion.easeOut, scrollTrigger: { trigger: sc, start: "top 65%", once: true } });
        gsap.fromTo(name, { yPercent: 28 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: sc, start: "top bottom", end: "top top", scrub: true } });
        gsap.fromTo(media, { scale: 0.82, rotate: k % 2 ? 4 : -4, yPercent: 12 }, { scale: 1, rotate: k % 2 ? 1 : -1, yPercent: 6, ease: "none", scrollTrigger: { trigger: sc, start: "top bottom", end: "center 55%", scrub: true } });
        if (k > 0) gsap.fromTo(sc, { "--arc": `${innerHeight * motion.sceneArc}px` }, { "--arc": "0px", ease: "none", scrollTrigger: { trigger: sc, start: "top bottom", end: "top top", scrub: true } });
        if (next) {
          ScrollTrigger.create({ trigger: sc, start: "bottom bottom", end: () => `+=${innerHeight}`, pin: true, pinSpacing: false });
          const under = { trigger: next, start: "top bottom", end: "top top", scrub: true };
          gsap.to(sc, { scale: motion.sceneRecede, ease: "none", scrollTrigger: under });
          gsap.to(sc.querySelector(".scene-dim"), { opacity: motion.sceneDim, ease: "none", scrollTrigger: under });
        }
      });
      gsap.from(".index-row", { yPercent: 60, autoAlpha: 0, duration: 0.9, ease: motion.easeSoft, stagger: 0.07, scrollTrigger: { trigger: ".index", start: "top 70%" } });
      const tilt = gsap.quickTo(".scene-media", "skewY", { duration: 0.5, ease: "power3.out" });
      const on = ({ velocity }: { velocity: number }) => tilt(gsap.utils.clamp(-motion.skewMax, motion.skewMax, velocity * motion.skewPerVelocity));
      lenis?.on("scroll", on);
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => lenis?.off("scroll", on);
    });
    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    const img = preview.current!;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => { cx += (x - cx) * 0.14; cy += (y - cy) * 0.14; img.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) rotate(${(x - cx) * 0.04}deg)`; raf = requestAnimationFrame(loop); };
    addEventListener("pointermove", move); raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  const onHover = (src: string | null) => { const img = preview.current!; if (src) img.src = src; img.classList.toggle("on", !!src); };

  return (
    <>
      <section className="work" id="work" aria-labelledby="work-h">
        <h2 className="sr-only" id="work-h">{site.work.heading}</h2>
        {featured.map((p, k) => <Scene key={p.slug} p={p} n={k + 1} onOpen={onOpen} />)}
      </section>
      <section className="index" aria-labelledby="index-h" data-paint="var(--black)" data-ink="var(--paper)" data-paint-early="top 125%">
        <SectionHeading id="index-h">{site.work.restHeading}</SectionHeading>
        <ul>{rest.map((p) => <Row key={p.slug} p={p} onOpen={onOpen} onHover={onHover} />)}</ul>
        {explorations.length > 0 && <>
          <h3 className="side-h">{site.work.sideHeading}</h3>
          <ul>{explorations.map((p) => <Row key={p.slug} p={p} onOpen={onOpen} onHover={onHover} small />)}</ul>
        </>}
      </section>
      <img className="preview" ref={preview} alt="" aria-hidden="true" />
    </>
  );
}
