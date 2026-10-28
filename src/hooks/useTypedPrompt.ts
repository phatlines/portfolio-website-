import { useEffect } from "react";
import { motion, reduceMotion } from "../lib/motion";

/**
 * Types the first line, holds it, then types and erases each of the others in turn, writing straight into `ref`
 * so there is no re-render per letter. `paused` (the visitor is typing) freezes it on the first line; reduced motion shows that line only.
 */
export function useTypedPrompt(ref: React.RefObject<HTMLElement | null>, lines: string[], run: boolean, paused: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion() || paused) { el.textContent = run || paused ? lines[0] : ""; el.dataset.line = "0"; return; }
    if (!run) { el.textContent = ""; return; }
    let t: ReturnType<typeof setTimeout>, line = 0, n = 0, dir: 1 | -1 = 1;
    const step = () => {
      const text = lines[line];
      n += dir;
      el.textContent = text.slice(0, n);
      el.dataset.line = String(line); // 0 is the question; 1 and up are examples a visitor can tap
      if (dir === 1 && n === text.length) { dir = -1; t = setTimeout(step, line === 0 ? motion.typeHoldFirst : motion.typeHold); return; }
      if (dir === -1 && n === 0) { dir = 1; line = (line + 1) % lines.length; t = setTimeout(step, 380); return; }
      t = setTimeout(step, dir === 1 ? motion.typeSpeed + Math.random() * 30 : motion.eraseSpeed);
    };
    t = setTimeout(step, 200);
    return () => clearTimeout(t);
  }, [ref, lines, run, paused]);
}
