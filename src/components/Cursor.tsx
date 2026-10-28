import { useEffect, useRef } from "react";

/** A dot that grows into a label ("drag", "open") over anything with data-cursor. Mouse only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const label = el.querySelector("span")!;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      el.classList.add("live");
      const text = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      if (label.textContent !== text) label.textContent = text;
      el.classList.toggle("has-label", !!text);
    };
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; raf = requestAnimationFrame(loop); };
    addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div className="cursor" ref={ref} aria-hidden="true"><span /></div>;
}
