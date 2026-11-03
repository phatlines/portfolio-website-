import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { Button } from "../components/Button";
import { HeroReveal } from "../components/HeroReveal";
import { GitHubMark, XMark } from "../components/Icons";

gsap.registerPlugin(SplitText);

/**
 * The first screen: who, what, where and whether I'm free, on the ink ground beside the portrait.
 * When the loader hands over (`ready`) the headline rises word by word and the photo shows its colour once.
 */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const q = gsap.utils.selector(root.current);
    const split = SplitText.create(q(".hero-h1")[0], { type: "words", mask: "words", wordsClass: "hw" });
    gsap.set(split.words, { yPercent: 110 });
    gsap.set(q(".hero-in"), { autoAlpha: 0, y: 14 });
    return () => split.revert();
  }, []);

  useLayoutEffect(() => {
    if (!ready || reduceMotion()) return;
    const q = gsap.utils.selector(root.current);
    const tl = gsap.timeline({ delay: 0.05 })
      .to(q(".hero-h1 .hw"), { yPercent: 0, duration: motion.words, stagger: motion.wordStagger, ease: motion.easeOut })
      .to(q(".hero-in"), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: motion.easeSoft }, 0.2);
    return () => { tl.kill(); };
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-h">
      <div className="hero-text">
        <p className="hero-facts hero-in">{site.person}<i>·</i>{site.role}<i>·</i>{site.based}</p>
        <h1 className="hero-h1" id="hero-h">{site.hero.heading}</h1>
        <p className="hero-lead hero-in">{site.hero.lead}</p>
        <div className="hero-actions hero-in">
          <Button href={mailto} onClick={startProject}>{site.nav.cta}</Button>
          <Button variant="secondary" href="#work">{site.hero.secondary}</Button>
        </div>
        <ul className="hero-links hero-in">
          <li><a className="mark-link" href={site.social.github.url} target="_blank" rel="noreferrer"><GitHubMark /><span><span className="sr-only">{site.social.github.label} </span>{site.social.github.handle}</span></a></li>
          <li><a className="mark-link" href={site.social.x.url} target="_blank" rel="noreferrer"><XMark /><span><span className="sr-only">{site.social.x.label} </span>{site.social.x.handle}</span></a></li>
          <li><a className="btn btn-link" href="#resume">{site.hero.resume}</a></li>
        </ul>
        <p className="hero-avail hero-in"><i className="dot" aria-hidden="true" />{site.availability.line}</p>
      </div>
      <div className="hero-photo">
        <HeroReveal sweep={ready} />
      </div>
    </section>
  );
}
