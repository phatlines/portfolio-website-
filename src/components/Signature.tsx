import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { reduceMotion } from "../lib/motion";

/**
 * The name written live in Mainstream: a pen moves left to right and the ink appears behind it,
 * letter by letter at an uneven, hand-like pace, with a lift between the two words.
 * (Placeholder until phatlines' real signature strokes arrive; PENDING.md.)
 */
export function Signature({ name, label }: { name: string; label: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const s = svg.current!;
    const text = s.querySelector("text")!, ink = s.querySelector<SVGRectElement>(".sig-ink")!, nib = s.querySelector<SVGCircleElement>(".sig-nib")!;
    let tl: gsap.core.Timeline | null = null, io: IntersectionObserver | null = null, cancelled = false;

    document.fonts.load('80px "Mainstream"').then(() => {
      if (cancelled) return;
      const box = text.getBBox();
      const pad = 24; // swashes reach past the glyph boxes
      const left = box.x - pad, top = box.y - pad, height = box.height + pad * 2;
      gsap.set(ink, { attr: { x: left, y: top, height, width: reduceMotion() ? box.width + pad * 2 : 0 } });
      if (reduceMotion()) { gsap.set(nib, { opacity: 0 }); return; }

      // One stop per letter: where the pen is when that letter is finished.
      const n = text.getNumberOfChars();
      const stops = Array.from({ length: n }, (_, i) => text.getExtentOfChar(i));
      const pen = { x: left, y: box.y + box.height * 0.6 };
      const draw = () => { gsap.set(ink, { attr: { width: pen.x - left } }); gsap.set(nib, { attr: { cx: pen.x, cy: pen.y } }); };
      draw();
      tl = gsap.timeline({ paused: true, onUpdate: draw });
      tl.set(nib, { opacity: 1 });
      let at = left; // where the pen will be when the previous letter is finished
      stops.forEach((r, i) => {
        const ch = name[i];
        if (ch === " ") { tl!.to(nib, { opacity: 0, duration: 0.12 }).to({}, { duration: 0.18 }).set(nib, { opacity: 1 }); return; } // pen lifts between words
        const speed = 0.0026 + Math.sin(i * 1.7) * 0.0008; // uneven, like a hand
        const end = i === n - 1 ? box.x + box.width + pad : r.x + r.width;
        tl!.to(pen, { x: end, duration: Math.max(0.06, (end - at) * speed), ease: "sine.inOut" }, ">")
          .to(pen, { y: r.y + r.height * (i % 2 ? 0.35 : 0.75), duration: 0.12, ease: "sine.inOut" }, "<");
        at = end;
      });
      tl.to(nib, { opacity: 0, duration: 0.3 });

      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl!.play(0); io!.disconnect(); } }, { threshold: 0.6 });
      io.observe(s);
    });
    return () => { cancelled = true; tl?.kill(); io?.disconnect(); };
  }, [name]);

  return (
    <svg ref={svg} className="signature" viewBox="0 0 900 220" role="img" aria-label={label}>
      <defs>
        <clipPath id="sig-clip"><rect className="sig-ink" x="0" y="0" width="0" height="220" /></clipPath>
      </defs>
      <text x="40" y="150" clipPath="url(#sig-clip)">{name}</text>
      <circle className="sig-nib" r="5" cx="0" cy="0" opacity="0" />
    </svg>
  );
}
