import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, reduceMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
/** The page's smooth scroller, so the overlay can pause it. Null with reduced motion. */
export const getLenis = () => lenis;

/** Smooth scroll driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion()) return;
    lenis = new Lenis({ lerp: motion.lenisLerp, wheelMultiplier: 1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
  }, []);
}
