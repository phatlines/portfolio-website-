import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Logo } from "../components/Logo";
import { site } from "../content/site";
import { films } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { LostZero } from "../components/LostZero";
import { RunningStrip } from "../components/RunningStrip";
import { Button } from "../components/Button";
import { Grain } from "../components/Grain";

gsap.registerPlugin(ScrambleTextPlugin);
const copy = site.notFound;
const reel = films();
const pad = (n: number) => String(n).padStart(2, "0");

/** Copy develops through timecode digits, like a slate being rewritten. */
const develop = (el: HTMLElement | null, text: string) => {
  if (!el) return;
  if (reduceMotion()) { el.textContent = text; return; }
  gsap.to(el, { duration: motion.develop, scrambleText: { text, chars: "0123456789:;", speed: 0.6, revealDelay: 0.15 } });
};

/** Running timecode on the slate, at 24 fps. Written straight to the DOM: no re-render per frame. */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduceMotion()) return;
    const t0 = performance.now();
    const id = setInterval(() => {
      const f = Math.floor((performance.now() - t0) / (1000 / 24));
      ref.current!.textContent = `${pad(Math.floor(f / 86400) % 24)}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
    }, 1000 / 24);
    return () => clearInterval(id);
  }, []);
  return <span className="tc" ref={ref}>00:00:00:00</span>;
}

/**
 * The 404: the zero missed its mark. Your films play out of focus behind the page; the zero is a lens
 * that brings them into focus, and putting it back on its mark brings the whole frame into focus.
 */
export function NotFound() {
  const [docked, setDocked] = useState(false);
  const [film, setFilm] = useState(0);
  const soft = useRef<HTMLVideoElement>(null), sharp = useRef<HTMLVideoElement>(null);
  const slot = useRef<HTMLSpanElement>(null), heading = useRef<HTMLHeadingElement>(null), line = useRef<HTMLParagraphElement>(null);
  const dragging = useRef(false);
  const p = reel[film];

  useEffect(() => { document.title = copy.title; }, []);

  // The set: the same film twice, blurred everywhere and sharp inside the lens. Kept in step once a second.
  useEffect(() => {
    if (!p) return;
    for (const v of [soft.current!, sharp.current!]) { v.src = p.media.src; v.play().catch(() => { /* autoplay refused: the poster stays */ }); }
    const id = setInterval(() => {
      const a = soft.current!, b = sharp.current!;
      if (Math.abs(a.currentTime - b.currentTime) > 0.08) b.currentTime = a.currentTime;
    }, 1000);
    return () => clearInterval(id);
  }, [p]);
  const next = () => setFilm((i) => (i + 1) % reel.length);

  const onDock = useCallback((d: boolean) => setDocked(d), []);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const c = docked ? copy.found : copy.lost;
    develop(heading.current, c.heading);
    develop(line.current, c.line);
  }, [docked]);

  return (
    <>
      <div className="set" aria-hidden="true">
        <video className="set-soft" ref={soft} muted playsInline preload="auto" poster={p?.media.poster} onEnded={next} />
        <video className="set-sharp" ref={sharp} muted playsInline preload="auto" poster={p?.media.poster} />
      </div>
      <Grain />
      <div className="viewfinder" aria-hidden="true"><i /><i /><i /><i /></div>

      <header className="nf-top">
        <a className="nav-mark" href="/"><Logo className="nav-logo" />{site.name}</a>
        <p className="nf-slate" aria-hidden="true"><span>{copy.slate[0]}</span><span>{copy.slate[1]}</span><Timecode /></p>
      </header>

      <main className={docked ? "nf docked" : "nf"}>
        <div className="nf-stage" aria-hidden="true">
          <div className="nf-code"><b>4</b><span className="nf-mark" ref={slot} /><b>4</b></div>
        </div>
        <LostZero slot={slot} docked={docked} onDock={onDock} dragging={dragging} label={copy.zeroLabel} />

        {/* The copy is written once by React, then rewritten in place by develop(), so React never fights the animation. */}
        <section className="nf-copy" aria-live="polite">
          <h1 ref={heading}>{copy.lost.heading}</h1>
          <p ref={line}>{copy.lost.line}</p>
          <div className="nf-actions">
            <Button href="/">{copy.home}</Button>
            {docked && p && <Button variant="outline" href={`/#work/${p.slug}`}>{copy.open} {p.name}</Button>}
          </div>
        </section>
      </main>

      <RunningStrip text={copy.strip} fast={dragging} />
    </>
  );
}
