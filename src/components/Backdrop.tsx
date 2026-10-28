import { useEffect, useRef } from "react";
import { createContours } from "../lib/contourShader";
import { reduceMotion } from "../lib/motion";

/**
 * Contour lines behind the page, in the style of landonorris.com: a few smooth, sweeping lines,
 * tone on tone with whatever colour the page is, flowing as you scroll and drifting slowly.
 * (If phatlines says "reverse background", swap this drawing for drifting film scratches.)
 */
export function Backdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = createContours(canvas.current!, reduceMotion());
    const onOverlay = () => c?.pause(document.documentElement.classList.contains("overlay-open"));
    const mo = new MutationObserver(onOverlay);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => { mo.disconnect(); c?.destroy(); };
  }, []);
  return <canvas className="backdrop" ref={canvas} aria-hidden="true" />;
}
