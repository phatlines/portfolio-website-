import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { getLenis } from "../hooks/useSmoothScroll";
import { SECTIONS, sectionLabel } from "../lib/sections";
import { Button } from "./Button";
import { Journal } from "./Journal";
import { GitHubMark, XMark } from "./Icons";

gsap.registerPlugin(MorphSVGPlugin);

// The button's two offset lines, the squiggle they pass through, and the X they become.
const LINES = { a: "M10 9 L19 9", b: "M5 15 L18 15" };
const WAVE = { a: "M5 9 C8 5 11 13 14 9 S18 7 19 9", b: "M5 15 C8 11 11 19 14 15 S17 13 18 15" };
const CROSS = { a: "M6 6 L18 18", b: "M18 6 L6 18" };
// The panel's top edge: flat at the bottom, a rising curve, then flat at the top (viewBox 0 0 100 100, stretched).
const EDGE = { down: "M0 100 C30 100 70 100 100 100 L100 100 L0 100 Z", mid: "M0 34 C30 8 70 8 100 34 L100 100 L0 100 Z", up: "M0 0 C30 0 70 0 100 0 L100 100 L0 100 Z" };

/**
 * Phones only. After landonorris.com's menu, rebuilt in GSAP (their Rive file is theirs): two offset lines squiggle into an X while the
 * button fills, an ink panel rises with a curved top edge that flattens, the links stack in the middle and the current one gets a drawn squiggle.
 * Esc closes, focus stays inside, the page stops scrolling.
 */
export function MobileMenu({ here, to }: { here: string; to: string }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null), tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(panel.current), b = gsap.utils.selector(btn.current);
    gsap.set(panel.current, { autoAlpha: 0 });
    tl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } })
      .set(panel.current, { autoAlpha: 1 })
      .to(b(".mm-a"), { morphSVG: WAVE.a, duration: 0.15, ease: "power1.in" }, 0)
      .to(b(".mm-b"), { morphSVG: WAVE.b, duration: 0.15, ease: "power1.in" }, 0)
      .to(b(".mm-a"), { morphSVG: CROSS.a, duration: 0.2, ease: "power2.out" }, 0.15)
      .to(b(".mm-b"), { morphSVG: CROSS.b, duration: 0.2, ease: "power2.out" }, 0.15)
      .to(btn.current, { "--mm-fill": 1, duration: 0.3 }, 0)
      .fromTo(q(".mm-edge"), { attr: { d: EDGE.down } }, { attr: { d: EDGE.mid }, duration: 0.28, ease: "power2.in" }, 0.05)
      .to(q(".mm-edge"), { attr: { d: EDGE.up }, duration: 0.27, ease: "power2.out" }, 0.33)
      .fromTo(q(".mm-item"), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.4, ease: motion.easeOut }, 0.3)
      .fromTo(q(".mm-foot"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.45);
    return () => { tl.current?.kill(); };
  }, []);

  // The squiggle under the current link draws in each time the menu opens.
  useEffect(() => {
    const s = panel.current?.querySelector<SVGPathElement>(`[data-id="${here}"] .mm-squiggle path`);
    if (!open || !s || reduceMotion()) return;
    const len = s.getTotalLength();
    gsap.fromTo(s, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.4, delay: 0.5, ease: "power2.out" });
  }, [open, here]);

  const set = useCallback((next: boolean) => {
    setOpen(next);
    document.documentElement.classList.toggle("menu-open", next);
    if (next) getLenis()?.stop(); else getLenis()?.start();
    const t = tl.current!;
    if (reduceMotion()) { t.progress(next ? 1 : 0).pause(); return; }
    if (next) t.timeScale(1).play(); else t.timeScale(1.25).reverse();
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); set(false); btn.current?.focus(); return; }
      if (e.key !== "Tab") return;
      const f = [btn.current!, ...panel.current!.querySelectorAll<HTMLElement>("a[href], button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, set]);

  // A link closes the menu first, then scrolls to its section.
  const go = (id: string) => (e: React.MouseEvent) => {
    if (to) return; // the 404 page: a normal link home
    e.preventDefault();
    set(false);
    const el = document.getElementById(id);
    setTimeout(() => (getLenis() ? getLenis()!.scrollTo(el!, { offset: -64 }) : el?.scrollIntoView()), motion.menu * 800);
  };

  return (
    <>
      <button ref={btn} type="button" className="mm-btn" aria-expanded={open} aria-controls="mm-panel" aria-label={open ? site.nav.menuClose : site.nav.menuOpen} onClick={() => set(!open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path className="mm-a" d={LINES.a} /><path className="mm-b" d={LINES.b} /></svg>
      </button>
      <div ref={panel} id="mm-panel" className="mm" aria-hidden={!open} inert={open ? undefined : true}>
        <svg className="mm-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="mm-edge" d={EDGE.down} /></svg>
        <nav className="mm-nav" aria-label={site.nav.main}>
          {[...SECTIONS.slice(0, 3), "journal", "contact"].map((id) => id === "journal"
            ? <div className="mm-item" key={id}><Journal className="mm-link" /></div>
            : <a className="mm-item mm-link" key={id} data-id={id} href={`${to}#${id}`} onClick={go(id)} aria-current={here === id ? "true" : undefined}>
                {sectionLabel[id as keyof typeof sectionLabel]}
                <svg className="mm-squiggle" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C14 1 22 11 34 6 S56 1 66 6 S88 11 98 5 S112 3 118 6" /></svg>
              </a>)}
        </nav>
        <div className="mm-foot">
          <Button href={mailto} onClick={(e) => { set(false); startProject(e); }}>{site.nav.cta}</Button>
          <div className="mm-social">
            <a href={site.social.github.url} target="_blank" rel="noreferrer" aria-label={`${site.social.github.label} ${site.social.github.handle}`}><GitHubMark /></a>
            <a href={site.social.x.url} target="_blank" rel="noreferrer" aria-label={`${site.social.x.label} ${site.social.x.handle}`}><XMark /></a>
          </div>
        </div>
      </div>
    </>
  );
}
