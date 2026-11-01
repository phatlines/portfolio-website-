import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { site } from "../content/site";
import { findProject, nextProject } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { Button } from "./Button";
import { LoopClip } from "./LoopClip";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = { slug: string; onClose: () => void; onOpen: (slug: string) => void };

// Match cut: remember where the clicked project sat on the page (its clip if it has one) so the overlay can grow out of it.
type Origin = { rect: DOMRect; radius: number; clip: boolean };
let pending: Origin | null = null;
// "Next project": the old page is already covered by the next colour, so the new page opens without its own wipe.
let sweeping = false;
addEventListener("click", (e) => {
  const a = (e.target as Element).closest?.('a[href^="#work/"]');
  if (!a || a.closest(".overlay")) { pending = null; return; }
  const clip = a.matches(".do-clip") ? a : a.closest(".wk-row") ? document.querySelector(".preview.on") : null; // a job clip, or the preview that follows the cursor over a work row
  const src = clip ?? a;
  pending = { rect: src.getBoundingClientRect(), radius: parseFloat(getComputedStyle(src).borderTopLeftRadius) || 0, clip: !!clip };
}, true);

/** clip-path that shows only `r` inside a box of size w×h. */
const insetOf = (r: DOMRect, w: number, h: number, radius: number) =>
  `inset(${r.top}px ${w - r.right}px ${h - r.bottom}px ${r.left}px round ${radius}px)`;
/** Transform that puts `from` exactly over `to` (transform-origin 0 0). */
const flip = (from: DOMRect, to: DOMRect) => ({ x: to.left - from.left, y: to.top - from.top, scaleX: to.width / from.width, scaleY: to.height / from.height });

/** One project's story, full screen in its own colour. Esc, the close button or Back closes it; focus returns where it was. */
export function ProjectOverlay({ slug, onClose, onOpen }: Props) {
  const p = findProject(slug)!;
  const next = nextProject(slug);
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const cut = useRef<Origin | null>(null);
  const closing = useRef(false);

  useEffect(() => {
    opener.current = document.activeElement;
    getLenis()?.stop();
    document.documentElement.classList.add("overlay-open");
    return () => {
      getLenis()?.start();
      document.documentElement.classList.remove("overlay-open");
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    const el = ref.current!;
    el.scrollTop = 0;
    el.querySelector<HTMLElement>(".ov-close")?.focus({ preventScroll: true });
    const o = (cut.current = pending), swept = sweeping;
    pending = null; sweeping = false;
    if (reduceMotion()) {
      const t = gsap.from(el, { autoAlpha: 0, duration: motion.cutFade });
      return () => { t.kill(); };
    }
    const media = el.querySelector<HTMLElement>(".ov-media")!;
    const tl = gsap.timeline();
    if (swept) {
      // already covered by the sweep: nothing to wipe
    } else if (o) {
      // The clip grows from its spot to its place in the overlay while the project colour opens out around it.
      tl.fromTo(el, { clipPath: insetOf(o.rect, el.offsetWidth, el.offsetHeight, o.radius) }, { clipPath: insetOf(new DOMRect(0, 0, el.offsetWidth, el.offsetHeight), el.offsetWidth, el.offsetHeight, 0), duration: motion.cutIn, ease: motion.cutEase, clearProps: "clipPath" });
      if (o.clip) tl.fromTo(media, { ...flip(media.getBoundingClientRect(), o.rect), transformOrigin: "0 0" }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: motion.cutIn, ease: motion.cutEase, clearProps: "transform" }, 0);
    } else {
      tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: motion.overlayIn, ease: "expo.inOut" });
    }
    const reveal = [...el.querySelectorAll(".ov-reveal")].filter((n) => !(o?.clip && n === media));
    tl.from(el.querySelector(".ov-media .clip"), { scale: 1.24, duration: motion.cutIn, ease: "power3.out" }, 0)
      .from(el.querySelectorAll(".ov-name .ch"), { yPercent: 110, stagger: 0.035, duration: 0.9, ease: motion.easeOut }, "-=0.2")
      .from(reveal, { autoAlpha: 0, y: 24, stagger: 0.06, duration: 0.6, ease: motion.easeSoft }, "-=0.7");
    return () => { tl.kill(); };
  }, [slug]);

  // The page has its own smooth scroll, the story arrives line by line, and the screenshot moves slower than the text.
  useLayoutEffect(() => {
    const el = ref.current!;
    if (reduceMotion()) return;
    const lenis = new Lenis({ wrapper: el, content: el.querySelector<HTMLElement>(".ov-content")!, lerp: motion.lenisLerp });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".ov-story p").forEach((para) => {
        SplitText.create(para, {
          type: "lines", mask: "lines", autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 105, stagger: 0.07, duration: 0.9, ease: motion.easeOut, scrollTrigger: { trigger: para, scroller: el, start: "top 92%", once: true } }),
        });
      });
      const clip = el.querySelector(".ov-media .clip");
      if (clip) gsap.fromTo(clip, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ".ov-media", scroller: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [slug]);

  // "Next project": the next colour sweeps up as an arch, then its page opens on top of it.
  const sweepTo = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = ref.current;
    if (closing.current || !el || reduceMotion()) { onOpen(to); return; }
    closing.current = true; sweeping = true;
    gsap.fromTo(el.querySelector(".ov-curtain"), { clipPath: "ellipse(75% 0% at 50% 100%)" }, { clipPath: "ellipse(120% 135% at 50% 100%)", duration: motion.sweep, ease: "power2.inOut", onComplete: () => onOpen(to) });
  };

  // Closing reverses the cut: the clip shrinks back to where it came from. Browser Back skips this and closes at once.
  const leave = useCallback(() => {
    const el = ref.current, o = cut.current;
    if (closing.current) return;
    if (!el || !o || reduceMotion()) { onClose(); return; }
    closing.current = true;
    const media = el.querySelector<HTMLElement>(".ov-media")!;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(el.querySelectorAll(".ov-name, .ov-reveal:not(.ov-media), .ov-story, .ov-close, .ov-next"), { autoAlpha: 0, duration: 0.18 })
      .to(el, { clipPath: insetOf(o.rect, el.offsetWidth, el.offsetHeight, o.radius), duration: motion.cutOut, ease: motion.cutEase }, 0.08);
    if (o.clip) tl.to(media, { ...flip(media.getBoundingClientRect(), o.rect), transformOrigin: "0 0", duration: motion.cutOut, ease: motion.cutEase }, 0.08);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current!;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); leave(); return; }
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [leave]);

  return (
    <div className="overlay" ref={ref} role="dialog" aria-modal="true" aria-labelledby="ov-name" style={{ "--oc": p.color, "--oi": p.ink } as React.CSSProperties} >
      <div className="ov-content">
      <div className="ov-bar"><button type="button" className="ov-close" onClick={leave} data-cursor="close">{site.overlay.close}</button></div>
      <div className="ov-grid">
        <header className="ov-head">
          <p className="ov-meta ov-reveal">
            <span>{p.type}</span><span>{p.year}</span>{p.tag && <span className="ov-tag">{p.tag}</span>}
          </p>
          <h2 className="ov-name" id="ov-name" aria-label={p.name} style={{ "--len": p.name.length } as React.CSSProperties}>
            {p.name.split(" ").map((w, k) => <span key={k}>{k > 0 && " "}<span className="word" aria-hidden="true">{w.split("").map((c, j) => <span className="ch" key={j}>{c}</span>)}</span></span>)}
          </h2>
        </header>
        <div className="ov-imac">
          <div className="ov-media ov-reveal"><LoopClip media={p.media} /></div>
          <i className="imac-chin ov-reveal" aria-hidden="true" />
          <i className="imac-stand ov-reveal" aria-hidden="true" />
        </div>
        <div className="ov-story">
          {p.story.map((s, i) => <p key={i}>{s}</p>)}
        </div>
        <dl className="ov-facts ov-reveal">
          <div><dt>{site.overlay.role}</dt><dd>{p.role}</dd></div>
          <div><dt>{site.overlay.builtWith}</dt><dd>{p.stack.join(", ")}</dd></div>
        </dl>
        <div className="ov-link ov-reveal">
          <Button variant="ink" href={mailto} onClick={startProject} data-cursor="write">{site.nav.cta}</Button>
          {p.liveUrl
            ? <Button variant="outline" href={p.liveUrl} target="_blank" rel="noreferrer">{site.overlay.live}</Button>
            : p.linkSoon ? <span className="ov-nolink">{site.overlay.noLink}</span> : null}
        </div>
      </div>
      <a className="ov-next" href={`#work/${next.slug}`} onClick={sweepTo(next.slug)} data-cursor="next">
        <span>{site.overlay.next}</span>
        <b style={{ "--len": next.name.length } as React.CSSProperties}>{next.name}</b>
      </a>
      </div>
      <div className="ov-curtain" aria-hidden="true" style={{ "--next": next.color } as React.CSSProperties} />
    </div>
  );
}
