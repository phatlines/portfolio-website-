import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { reel } from "../lib/projects";
import { motion } from "../lib/motion";
import { HERO_SRC } from "./HeroReveal";
import { Tick } from "./Icons";

const loadImage = (src: string) => new Promise<void>((done) => { const i = new Image(); i.onload = i.onerror = () => done(); i.src = src; });
const pageLoaded = () => new Promise<void>((done) => (document.readyState === "complete" ? done() : addEventListener("load", () => done(), { once: true })));

/**
 * The opening: the page builds like a project. Each line ticks off when its files have really loaded,
 * and the counter follows the real progress. Never shorter than motion.loaderMin, never longer than motion.loaderMax;
 * any key or tap skips it. The ink ground stays behind as the hero's, so there's no cut.
 */
export function BuildLoader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null), count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState<boolean[]>(site.loader.steps.map(() => false));
  const [took, setTook] = useState<string | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    const t0 = performance.now();
    const steps = [
      Promise.all([document.fonts.load("1em 'Prox Yo'"), document.fonts.load("1em 'Hanken Grotesk'")]),
      Promise.all([loadImage(HERO_SRC.bw), loadImage(HERO_SRC.colour)]),
      Promise.all(reel.slice(0, 4).map((p) => loadImage(p.media.poster))),
      pageLoaded(),
    ];
    const shown = { n: 0 }, total = steps.length;
    let settled = 0;
    const draw = () => { if (count.current) count.current.textContent = String(Math.round(shown.n)).padStart(3, "0"); };
    const advance = () => gsap.to(shown, { n: (settled / total) * 100, duration: 0.5, ease: "power2.out", onUpdate: draw });
    steps.forEach((p, i) => p.then(() => { settled++; setDone((d) => d.map((v, j) => v || j === i)); advance(); }));

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setTook(((performance.now() - t0) / 1000).toFixed(1));
      gsap.to(shown, { n: 100, duration: 0.25, onUpdate: draw });
      const q = gsap.utils.selector(root.current);
      gsap.timeline({ delay: 0.35, onComplete: onDone })
        .to(q(".bl-log li"), { yPercent: -120, autoAlpha: 0, stagger: 0.03, duration: 0.4, ease: "power3.in" })
        .to(q(".bl-count"), { yPercent: 100, autoAlpha: 0, duration: 0.4, ease: "power3.in" }, 0.05)
        .to(root.current, { autoAlpha: 0, duration: 0.3 }, 0.35);
    };
    const min = new Promise((r) => setTimeout(r, motion.loaderMin * 1000));
    Promise.all([...steps, min]).then(finish);
    const cap = setTimeout(finish, motion.loaderMax * 1000);
    addEventListener("keydown", finish);
    addEventListener("pointerdown", finish);
    return () => { clearTimeout(cap); removeEventListener("keydown", finish); removeEventListener("pointerdown", finish); };
  }, [onDone]);

  useLayoutEffect(() => { gsap.from(root.current!.querySelectorAll(".bl-log li"), { autoAlpha: 0, x: -8, stagger: 0.05, duration: 0.3 }); }, []);

  return (
    <div className="bl" ref={root} role="status" aria-label={site.loader.cmd}>
      <ol className="bl-log" aria-hidden="true">
        <li className="bl-cmd"><span className="bl-prompt">&gt;</span> {site.loader.cmd}</li>
        {site.loader.steps.map((s, i) => (
          <li key={s.name} className={done[i] ? "ok" : ""}><span className="bl-tick"><Tick /></span><b>{s.name}</b><span>{s.detail}</span></li>
        ))}
        <li className={`bl-ready${took ? " ok" : ""}`}>{took ? `${site.loader.ready} ${took}s` : ""}<i className="bl-caret" /></li>
      </ol>
      <span className="bl-count" ref={count} aria-hidden="true">000</span>
      <span className="bl-skip">{site.loader.skip}</span>
    </div>
  );
}
