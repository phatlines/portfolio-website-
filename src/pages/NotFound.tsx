import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { motion } from "../lib/motion";
import { TopBar } from "../sections/TopBar";
import { Backdrop } from "../components/Backdrop";
import { ContactCard } from "../components/ContactCard";
import { Button } from "../components/Button";

gsap.registerPlugin(SplitText);
const copy = site.notFound;

/** The address they asked for, read in their own browser and never sent anywhere. Null when there is nothing worth showing. */
const askedFor = () => {
  try {
    const p = decodeURIComponent(location.pathname);
    if (p === "/" || /^\/404(\.html)?$/.test(p)) return null;
    return p.length > 48 ? `${p.slice(0, 47)}…` : p;
  } catch { return null; }
};

/**
 * The 404, after upclose.studio's: a huge faded "404" cropped by the screen, a small label, one plain line.
 * The pun is the logo's slash, which is also the slash in a web address. Beyond theirs it shows the address that was asked for,
 * and the site's contour lines run behind it.
 */
export function NotFound() {
  const root = useRef<HTMLDivElement>(null);
  const path = askedFor();

  useLayoutEffect(() => {
    document.title = copy.title;
    const el = root.current!, q = gsap.utils.selector(el);
    const split = SplitText.create(q(".nf-h")[0], { type: "words", mask: "words", wordsClass: "hw" });
    const rest = q(".nf-in");
    gsap.set(split.words, { yPercent: 115 });
    gsap.set(rest, { autoAlpha: 0, y: 16 });
    gsap.set(q(".nf-digits"), { autoAlpha: 0, scale: motion.nfZoom });
    const tl = gsap.timeline();
    tl.to(q(".nf-digits"), { autoAlpha: 1, scale: 1, duration: motion.nfIn, ease: motion.easeOut }, 0)
      .to(rest[0], { autoAlpha: 1, y: 0, duration: 0.6, ease: motion.easeSoft }, 0.25)
      .to(split.words, { yPercent: 0, duration: 0.8, stagger: 0.07, ease: motion.easeOut }, 0.4)
      .to(rest.slice(1), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: motion.easeSoft }, 0.7);
    // On desktop the digits drift a little against the pointer, for depth.
    let off: (() => void) | undefined;
    if (matchMedia("(pointer: fine)").matches) {
      const x = gsap.quickTo(q(".nf-digits"), "x", { duration: 1.2, ease: "power3" }), y = gsap.quickTo(q(".nf-digits"), "y", { duration: 1.2, ease: "power3" });
      const move = (e: PointerEvent) => { x(-(e.clientX / innerWidth - 0.5) * motion.nfDrift); y(-(e.clientY / innerHeight - 0.5) * motion.nfDrift); };
      addEventListener("pointermove", move);
      off = () => removeEventListener("pointermove", move);
    }
    return () => { tl.kill(); split.revert(); off?.(); };
  }, []);

  return (
    <div ref={root} className="nf">
      <Backdrop />
      <TopBar home />
      <div className="nf-digits-wrap" aria-hidden="true"><div className="nf-digits">404</div></div>
      <main className="nf-main">
        <p className="nf-label nf-in">{copy.label}</p>
        <h1 className="nf-h">{copy.heading}</h1>
        <p className="nf-path nf-in">{path ? <>{copy.path} <b>{path}</b>.</> : copy.noPath}</p>
        <div className="nf-in"><Button href="/">{copy.home}</Button></div>
      </main>
      <ContactCard />
    </div>
  );
}
