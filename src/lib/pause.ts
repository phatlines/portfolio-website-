import { reduceMotion } from "./motion";

/**
 * A pause the visitor can choose for everything that moves by itself: the typing, the pulsing dot, the carets, the page tours and the video loops.
 * Motion is on by default; this only exists so nothing runs on its own with no way to stop it (WCAG 2.2.2).
 */
let paused = false;
const subs = new Set<() => void>();
export const isPaused = () => paused;
export const subscribePause = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export function setPaused(next: boolean) {
  paused = next;
  document.documentElement.toggleAttribute("data-paused", next); // the CSS animations stop on this
  subs.forEach((f) => f());
}

/** Plays a muted loop only while it is on screen and motion isn't paused. Returns the cleanup. */
export function loopWhenVisible(v: HTMLVideoElement, threshold: number) {
  let visible = false;
  const sync = () => (visible && !paused && !reduceMotion() ? v.play().catch(() => {}) : v.pause());
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold });
  io.observe(v);
  const off = subscribePause(sync);
  return () => { io.disconnect(); off(); };
}
