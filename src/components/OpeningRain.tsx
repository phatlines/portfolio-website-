import { useEffect, useRef } from "react";
import { motion } from "../lib/motion";

/**
 * The loading backdrop, after metronome.com's 404: thin columns of letters falling behind the paper window, each column spelling one of the
 * words it is given, tone on tone with the page. When the window opens the rain speeds up and fades. One canvas, one loop, only while it is showing.
 */
export function OpeningRain({ words, active }: { words: string[]; active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(active);
  live.current = active;

  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const cell = innerWidth < 760 ? 26 : 34, size = cell * 0.62;
    const family = getComputedStyle(c).getPropertyValue("--head") || "sans-serif";
    const cols: { x: number; y: number; v: number; word: string; len: number }[] = [];
    const resize = () => {
      c.width = innerWidth * dpr; c.height = c.clientHeight * dpr;
      cols.length = 0;
      for (let x = 0; x < innerWidth; x += cell) {
        const word = words[Math.floor(Math.random() * words.length)].toUpperCase().replace(/\s/g, "");
        cols.push({ x: x + cell / 2, y: Math.random() * c.clientHeight * 1.3, v: 0.55 + Math.random() * 0.9, word, len: 8 + Math.floor(Math.random() * 12) });
      }
    };
    resize();
    addEventListener("resize", resize);
    let last = performance.now(), boost = 1, raf = 0, alpha = 1;
    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      boost += ((live.current ? 1 : 5) - boost) * Math.min(dt * 4, 1);
      alpha += ((live.current ? 1 : 0) - alpha) * Math.min(dt * 3.5, 1);
      c.style.opacity = String(alpha);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, c.clientHeight);
      ctx.font = `${size}px ${family}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const H = c.clientHeight;
      for (const col of cols) {
        col.y += motion.rainSpeed * col.v * boost * dt;
        if (col.y - col.len * cell > H) { col.y = -cell; col.word = words[Math.floor(Math.random() * words.length)].toUpperCase().replace(/\s/g, ""); }
        for (let k = 0; k < col.len; k++) {
          const y = col.y - k * cell;
          if (y < -cell || y > H + cell) continue;
          ctx.fillStyle = k === 0 ? "rgb(255 253 248 / .8)" : `rgb(11 11 11 / ${0.42 * (1 - k / col.len)})`;
          ctx.fillText(col.word[(col.len - k + Math.floor(col.y / cell)) % col.word.length] ?? "", col.x, y);
        }
      }
      if (live.current || alpha > 0.02) raf = requestAnimationFrame(frame); else raf = 0;
    };
    raf = requestAnimationFrame(frame);
    const wake = setInterval(() => { if (live.current && !raf) { alpha = Math.max(alpha, 0.01); last = performance.now(); raf = requestAnimationFrame(frame); } }, 400);
    return () => { cancelAnimationFrame(raf); clearInterval(wake); removeEventListener("resize", resize); };
  }, [words]);

  return <canvas className="opening-rain" ref={canvas} aria-hidden="true" />;
}
