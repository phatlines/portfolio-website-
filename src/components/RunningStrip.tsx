import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, reduceMotion } from "../lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");
const COPIES = 4; // the run is two identical halves of this many pieces, so it loops without a seam

/** Words running through a film gate, with timecode notes. Runs faster while `fast` is true. */
export function RunningStrip({ text, fast }: { text: string; fast: React.RefObject<boolean> }) {
  const run = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion()) return;
    const el = run.current!;
    let x = 0, speed = 1;
    const step = (_t: number, dt: number) => {
      speed += ((fast.current ? motion.stripDragBoost : 1) - speed) * 0.06;
      x -= speed * dt * motion.stripSpeed;
      const half = el.scrollWidth / 2;
      if (-x > half) x += half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(step);
    return () => gsap.ticker.remove(step);
  }, [fast]);

  const pieces = Array.from({ length: COPIES * 2 }, (_, k) => k % COPIES);
  return (
    <div className="run-strip" aria-hidden="true">
      <div className="run" ref={run}>
        {pieces.map((i, k) => (
          <span className="run-piece" key={k}><b>{text}</b><small>04:0{i}:{pad(i * 7)}:{pad(i * 3)}</small></span>
        ))}
      </div>
    </div>
  );
}
