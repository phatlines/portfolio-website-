import { useEffect, useRef, useState } from "react";
import { site } from "../content/site";
import { reduceMotion } from "../lib/motion";
import { createReveal, type Reveal } from "../lib/revealShader";

// The photo is at most ~45% of the screen wide, so 1200px covers most screens; dense or wide screens get the 1792px pair.
const big = typeof window !== "undefined" && innerWidth * 0.45 * devicePixelRatio > 1200;
export const HERO_SRC = {
  bw: `/media/hero-bw-${big ? 1792 : 1200}.webp`,
  colour: `/media/hero-colour-${big ? 1792 : 1200}.webp`,
};

/**
 * The portrait: black-and-white on top, colour underneath, shown round the pointer (see lib/revealShader.ts).
 * Without WebGL 2 the colour shows through a soft circle that follows the pointer instead; with reduced motion the colour photo simply shows.
 * The black-and-white <img> is always in the page, so the photo and its description are there before (and without) any script.
 */
export function HeroReveal({ sweep }: { sweep: boolean }) {
  const area = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), api = useRef<Reveal | null>(null);
  const [mode, setMode] = useState<"loading" | "gl" | "css" | "static">("loading");

  useEffect(() => {
    if (reduceMotion()) { setMode("static"); return; }
    let gone = false;
    createReveal(canvas.current!, area.current!, HERO_SRC).then((r) => {
      if (gone) { r?.destroy(); return; }
      api.current = r;
      setMode(r ? "gl" : "css");
    });
    return () => { gone = true; api.current?.destroy(); api.current = null; };
  }, []);

  // CSS fallback: a soft circle of colour that trails the pointer.
  useEffect(() => {
    if (mode !== "css") return;
    const el = area.current!;
    let x = 0, y = 0, tx = 0, ty = 0, r = 0, tr = 0, raf = 0;
    const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; tr = 140; };
    const leave = () => { tr = 0; };
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18; r += (tr - r) * 0.12;
      el.style.setProperty("--rx", `${x}px`); el.style.setProperty("--ry", `${y}px`); el.style.setProperty("--rr", `${r}px`);
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [mode]);

  useEffect(() => { if (sweep && mode === "gl") api.current?.sweep(); }, [sweep, mode]);

  return (
    <div className={`reveal reveal-${mode}`} ref={area}>
      <img className="reveal-bw" src={HERO_SRC.bw} alt={site.hero.photoAlt} width={1792} height={2400} fetchPriority="high" />
      <img className="reveal-col" src={HERO_SRC.colour} alt="" aria-hidden="true" width={1792} height={2400} />
      <canvas ref={canvas} aria-hidden="true" />
      <span className="reveal-hint" aria-hidden="true">{site.hero.revealHint}</span>
    </div>
  );
}
