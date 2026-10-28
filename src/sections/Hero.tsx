import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { featured } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { PromptBar } from "../components/PromptBar";
import { HeroPeek } from "../components/HeroPeek";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = { playing: boolean; onSeen: () => void; onOpen: (slug: string) => void };

/** Phones and tall screens get a square window; wide screens a rectangle. */
const squareShaped = () => innerWidth < 760 || innerHeight > innerWidth * 1.15;
const FULL = "inset(0px 0px 0px 0px round 0px 0px 0px 0px)";

/**
 * A light headline, a prompt bar that finds the work, and real work peeking up from the bottom.
 * The opening (once per session) is driven by the visitor, not a timer: the page starts as the first project's colour with a paper window
 * holding the typed question, and the window opens to the full screen as you scroll (desktop, scrubbed both ways) or on your first swipe (touch, one go).
 * Tapping, typing or waiting a few seconds opens it too. Afterwards the same colour rises over the hero so Work begins without a seam.
 */
export function Hero({ playing, onSeen, onOpen }: Props) {
  const root = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(playing);
  const scrubbed = useMemo(() => playing && !matchMedia("(pointer: coarse)").matches, [playing]);

  useLayoutEffect(() => {
    if (!playing) return;
    const el = root.current!, q = gsap.utils.selector(el), paper = q(".hero-paper");
    const nav = document.querySelector<HTMLElement>(".nav")!;
    const later = [nav, ...q(".pb-row"), ...q(".hero-peek")];
    const split = SplitText.create(q(".hero-h1")[0], { type: "words", mask: "words", wordsClass: "hw" });

    // The closed window is centred on the typed line: a rectangle as wide as the bar, or a square on phones.
    const field = q(".pb-field")[0].getBoundingClientRect(), square = squareShaped();
    const w = square ? Math.min(innerWidth * 0.92, 360) : Math.min(760, innerWidth * 0.92);
    const h = square ? w : Math.min(innerHeight * 0.5, 340);
    const cy = Math.min(Math.max(field.top + 24, h / 2 + 16), innerHeight - h / 2 - 16), x = (innerWidth - w) / 2; // 24px down the field is where the typed line sits
    const from = `inset(${cy - h / 2}px ${x}px ${innerHeight - cy - h / 2}px ${x}px round 16px 16px 16px 16px)`;

    gsap.set(split.words, { yPercent: 115 });
    gsap.set(later, { autoAlpha: 0, y: 12 });
    let closed = true, seen = false;
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const c = tl.time() < 1;
        if (c !== closed) { closed = c; setOpening(c); }
        if (!seen && tl.progress() === 1) { seen = true; onSeen(); }
      },
    });
    // from-to: the browser shortens equal insets, which would misalign a plain .to()
    tl.fromTo(paper, { clipPath: from }, { clipPath: FULL, duration: 1, ease: "power3.inOut" }, 0)
      .fromTo(q(".hero-grid"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.45)
      .to(split.words, { yPercent: 0, duration: 0.7, stagger: 0.07, ease: motion.easeOut }, 0.5)
      .to(later, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: motion.easeSoft }, 1);

    let idle: ReturnType<typeof setTimeout>;
    const st = scrubbed ? ScrollTrigger.create({ animation: tl, trigger: track.current, start: "top top", end: () => `+=${innerHeight}`, scrub: 0.5, invalidateOnRefresh: true }) : null;
    const open = () => {
      clearTimeout(idle);
      if (tl.progress() === 1 || (!scrubbed && tl.isActive())) return;
      if (scrubbed) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(innerHeight, { duration: motion.idleOpenScroll, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
        else scrollTo({ top: innerHeight, behavior: "smooth" });
      } else tl.play();
    };
    const arm = () => { clearTimeout(idle); if (tl.progress() < 1) idle = setTimeout(open, motion.idleOpenMs); };

    // Touch: the page stays put until the first swipe, then the opening plays once. Desktop scrolls through it natively.
    let y0 = 0;
    const locks: [string, EventListener, AddEventListenerOptions][] = scrubbed ? [] : [
      ["wheel", (e) => { e.preventDefault(); if ((e as WheelEvent).deltaY > 0) open(); }, { passive: false }],
      ["touchstart", (e) => { y0 = (e as TouchEvent).touches[0].clientY; }, { passive: true }],
      ["touchmove", (e) => { e.preventDefault(); if (y0 - (e as TouchEvent).touches[0].clientY > 6) open(); }, { passive: false }],
    ];
    const keys = (e: KeyboardEvent) => { if (["ArrowDown", "PageDown", " ", "End"].includes(e.key) && !(e.target instanceof HTMLInputElement)) { if (!scrubbed) e.preventDefault(); open(); } };
    const unlock = () => { locks.forEach(([t, f, o]) => removeEventListener(t, f, o)); getLenis()?.start(); };
    if (!scrubbed) { locks.forEach(([t, f, o]) => addEventListener(t, f, o)); getLenis()?.stop(); tl.eventCallback("onComplete", unlock); }
    const poke = () => { arm(); };
    el.addEventListener("click", open); el.addEventListener("focusin", open); addEventListener("keydown", keys);
    (["wheel", "touchstart", "pointerdown", "scroll"] as const).forEach((t) => addEventListener(t, poke, { passive: true }));
    arm();

    return () => {
      clearTimeout(idle); st?.kill(); tl.kill(); split.revert(); unlock();
      gsap.set(later, { clearProps: "all" }); gsap.set(paper, { clearProps: "clipPath" });
      el.removeEventListener("click", open); el.removeEventListener("focusin", open); removeEventListener("keydown", keys);
      (["wheel", "touchstart", "pointerdown", "scroll"] as const).forEach((t) => removeEventListener(t, poke));
    };
  }, [playing, scrubbed, onSeen]);

  // On scroll: the content lifts away and sinks back while the first project's colour rises as an arch over the hero.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: track.current, start: () => (scrubbed ? innerHeight : 0), end: () => (scrubbed ? 2 : 1) * innerHeight, scrub: 0.6, invalidateOnRefresh: true } })
        .to([".hero-inner", ".hero-peek"], { yPercent: -8, scale: 0.94, autoAlpha: 0, duration: 0.75, ease: "none" }, 0)
        .fromTo(".hero-rise", { clipPath: "ellipse(75% 0% at 50% 100%)" }, { clipPath: "ellipse(120% 135% at 50% 100%)", duration: 1 - motion.riseStart, ease: "power2.inOut", immediateRender: false }, motion.riseStart);
    }, root);
    return () => ctx.revert();
  }, [scrubbed]);

  return (
    <div ref={track} className={`hero-track${scrubbed ? " scrubbed" : ""}`}>
      <section ref={root} className={`hero${opening ? " opening" : ""}`} aria-labelledby="hero-name" data-paint="var(--paper)" data-ink="var(--black)"
        style={{ "--rise": featured[0]?.color } as React.CSSProperties}>
        <div className="hero-paper" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-inner">
          <h1 className="hero-h1" id="hero-name">{site.hero.heading}</h1>
          <div className="hero-stage"><PromptBar typing onOpen={onOpen} /></div>
        </div>
        <HeroPeek onOpen={onOpen} />
        <div className="hero-cue" aria-hidden="true" />
        <div className="hero-rise" aria-hidden="true" />
      </section>
    </div>
  );
}
