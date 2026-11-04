import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, reduceMotion } from "../lib/motion";
import { getLenis, setLenis } from "../lib/scroller";

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion()) return;
    const lenis = new Lenis({ lerp: motion.lenisLerp, wheelMultiplier: 1, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); if (getLenis() === lenis) setLenis(null); };
  }, []);
}
