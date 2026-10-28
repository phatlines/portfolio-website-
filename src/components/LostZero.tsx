import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { motion, reduceMotion } from "../lib/motion";

gsap.registerPlugin(Draggable, InertiaPlugin);

type Props = {
  slot: React.RefObject<HTMLElement | null>; // the tape mark the zero belongs on
  docked: boolean;
  onDock: (docked: boolean) => void;
  dragging: React.RefObject<boolean>; // read by the film strip, which runs faster while you drag
  label: string;
};

/**
 * The 404's zero: a lens you can pick up. Wherever it floats, the out-of-focus set behind it is sharp
 * (it writes the lens position to --lx/--ly/--rx/--ry on the root). Drop it on its mark to dock it.
 */
export function LostZero({ slot, docked, onDock, dragging, label }: Props) {
  const zero = useRef<HTMLDivElement>(null);
  const api = useRef<{ dock: () => void; leave: () => void } | null>(null);

  useLayoutEffect(() => {
    const el = zero.current!, root = document.documentElement, reduce = reduceMotion();
    const pos = () => ({ x: +gsap.getProperty(el, "x"), y: +gsap.getProperty(el, "y") });
    let drift: gsap.core.Tween | undefined, anchor = { x: 0, y: 0 }, isDocked = false;

    // The lens follows the zero. Sizes come from the glyph, so it fits every width.
    const lens = () => {
      const r = el.getBoundingClientRect();
      root.style.setProperty("--lx", `${r.left + r.width / 2}px`);
      root.style.setProperty("--ly", `${r.top + r.height * 0.56}px`);
      root.style.setProperty("--rx", `${r.width * 0.95}px`);
      root.style.setProperty("--ry", `${r.height * 0.62}px`);
    };
    gsap.ticker.add(lens);
    root.style.setProperty("--blur", `${motion.lensBlur}px`);

    // Where the zero belongs, as a transform.
    const home = () => {
      const s = slot.current!.getBoundingClientRect(), z = el.getBoundingClientRect(), p = pos();
      return { x: p.x + s.left + s.width / 2 - (z.left + z.width / 2), y: p.y + s.top + s.height * 0.52 - (z.top + z.height * 0.56) };
    };
    // Off its mark: top right, fully on screen and clear of the slate.
    const lost = () => {
      const r = el.getBoundingClientRect(), w = r.width / +gsap.getProperty(el, "scaleX"), h = r.height / +gsap.getProperty(el, "scaleY");
      const phone = innerWidth < 760;
      return { x: Math.min(innerWidth - w - (phone ? 20 : innerWidth * 0.06), innerWidth * (phone ? 0.5 : 0.76)), y: phone ? 64 : Math.max(72, innerHeight * 0.1) - h * 0.14 };
    };
    const near = () => { const h = home(), p = pos(); return Math.hypot(h.x - p.x, h.y - p.y) < Math.min(160, innerWidth * 0.22); };

    // A slow, uneven float around where it was left, like a lens on a loose arm.
    const wander = () => {
      drift?.kill();
      if (reduce || isDocked) return;
      const r = gsap.utils.random;
      drift = gsap.to(el, {
        x: anchor.x + r(-motion.driftX, motion.driftX), y: anchor.y + r(-motion.driftY, motion.driftY), rotation: r(-12, 12),
        duration: r(motion.driftMin, motion.driftMax), ease: "sine.inOut", onComplete: wander,
      });
    };

    const dock = () => {
      if (isDocked) return;
      isDocked = true; drift?.kill();
      gsap.to(el, { ...home(), rotation: 0, scale: 1, autoAlpha: 1, duration: reduce ? 0 : motion.zeroDock, ease: motion.zeroDockEase });
      gsap.to(root, { "--blur": "0px", duration: reduce ? 0 : motion.focusPull, ease: "power2.out", delay: reduce ? 0 : 0.25 });
      onDock(true);
    };
    const undock = () => {
      if (!isDocked) return;
      isDocked = false;
      gsap.to(root, { "--blur": `${motion.lensBlur}px`, duration: reduce ? 0 : motion.focusLoss, ease: "power2.out" });
      onDock(false);
    };
    const leave = () => { undock(); anchor = lost(); gsap.to(el, { ...anchor, rotation: -8, duration: reduce ? 0 : motion.zeroReturn, ease: motion.easeOut, onComplete: wander }); };
    const settle = () => {
      if (isDocked) return;
      if (near()) dock(); else { anchor = pos(); wander(); }
    };
    api.current = { dock, leave };

    const [drag] = Draggable.create(el, {
      inertia: !reduce, bounds: window, maxDuration: 1.2, throwResistance: 2600,
      onPress() { drift?.kill(); dragging.current = true; undock(); },
      // Let go near the mark and it catches, however fast you were moving; anywhere else it coasts.
      onRelease() {
        dragging.current = false;
        if (near()) requestAnimationFrame(() => { drag.tween?.kill(); dock(); });
        else if (!this.isThrowing) settle();
      },
      onThrowComplete: settle,
    });

    // Start: already off its mark, drifting. Wait for Gebuk so the sizes are real.
    let alive = true;
    document.fonts.load(`1em ${getComputedStyle(el).fontFamily}`).then(() => document.fonts.ready).then(() => {
      if (!alive) return;
      anchor = lost();
      gsap.set(el, { ...anchor, rotation: -8 });
      if (!reduce) gsap.from(el, { autoAlpha: 0, scale: 0.6, duration: motion.zeroIn, ease: motion.easeOut });
      wander();
    });
    const onResize = () => { if (isDocked) gsap.set(el, home()); };
    addEventListener("resize", onResize);

    return () => {
      alive = false;
      gsap.ticker.remove(lens);
      removeEventListener("resize", onResize);
      drag.kill(); drift?.kill(); gsap.killTweensOf([el, root]);
    };
  }, [slot, onDock, dragging]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (docked) api.current?.leave(); else api.current?.dock();
  };

  return (
    <>
      <div className="lens-rim" aria-hidden="true" />
      <div className="zero" ref={zero} role="button" tabIndex={0} aria-pressed={docked} aria-label={label} onKeyDown={onKey}>0</div>
    </>
  );
}
