import { useEffect } from "react";

/** The page's dot grid: the dots round the pointer light up green, trailing it a little. The ink hero sits on top and hides it. */
export function useDotLight() {
  useEffect(() => {
    if (matchMedia("(hover: none)").matches) return;
    const dots = document.querySelector<HTMLElement>(".dots")!.style;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.5) { // still: no write, so no restyle or repaint
        cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
        dots.setProperty("--mx", `${cx}px`); dots.setProperty("--my", `${cy}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
}
