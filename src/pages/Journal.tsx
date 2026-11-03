import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { useDotLight } from "../hooks/useDotLight";
import { TopBar } from "../sections/TopBar";
import { Footer } from "../sections/Footer";
import { ContactCard } from "../components/ContactCard";

const copy = site.journal;

/** The Journal isn't open yet: a page of its own on the site's dot-grid background, with a note to come back later. */
export function Journal() {
  const root = useRef<HTMLDivElement>(null);
  useDotLight();

  useLayoutEffect(() => {
    document.title = copy.title;
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".jn-in", { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.8, ease: motion.easeSoft, delay: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="jn">
      <div className="dots" aria-hidden="true" />
      <TopBar home />
      <main className="jn-main" id="top">
        <h1 className="jn-h jn-in">{copy.heading}</h1>
        <p className="jn-p jn-in">{copy.body}</p>
        <a className="btn btn-link jn-in" href="/">{copy.back}</a>
      </main>
      <Footer />
      <ContactCard />
    </div>
  );
}
