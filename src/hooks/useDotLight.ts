import { useEffect } from "react";

const GAP = 24, HALF = 180; // the dot spacing and half of the glow block (360px) in site.css

/** The page's dot grid: the dots round the pointer light up green. The glow block steps one cell at a time and only moves by transform. The ink hero sits on top and hides it. */
export function useDotLight() {
  useEffect(() => {
    if (matchMedia("(hover: none)").matches) return;
    const dots = document.querySelector<HTMLElement>(".dots")!.style;
    let lx = NaN, ly = NaN;
    const move = (e: PointerEvent) => {
      const gx = Math.round((e.clientX - HALF) / GAP) * GAP, gy = Math.round((e.clientY - HALF) / GAP) * GAP;
      if (gx === lx && gy === ly) return; // still inside the same cell: nothing to do
      lx = gx; ly = gy;
      dots.setProperty("--gx", `${gx}px`); dots.setProperty("--gy", `${gy}px`);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);
}
