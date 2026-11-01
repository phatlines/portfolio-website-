import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { findProject } from "../lib/projects";
import { motion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { startProject } from "../lib/contact";
import { mailto } from "../lib/mailto";
import { Button } from "../components/Button";

gsap.registerPlugin(ScrollTrigger, SplitText);
const jobs = site.make.jobs.map((j) => ({ ...j, p: findProject(j.example) }));

/**
 * The jobs, right after the hero. The page holds still and each job takes the screen in turn: one huge word beside a clip of a project that proves it.
 * The tabs along the bottom show where you are and jump to a job. Each word is hidden outright once it has left, so two never show at once.
 */
export function Make({ onOpen }: { onOpen: (slug: string) => void }) {
  const root = useRef<HTMLElement>(null);
  const jump = useRef<(i: number) => void>(() => {});

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const words = q(".do-word"), clips = q(".do-clip"), tabs = q(".do-tab");
      const splits = words.map((w) => SplitText.create(w, { type: "words,chars", mask: "chars", wordsClass: "word", charsClass: "ch" }));
      gsap.set(words, { autoAlpha: 0 });
      gsap.set(words[0], { autoAlpha: 1 });
      gsap.set(q(".do-reel, .do-tabs, .do-cta"), { autoAlpha: 0 });
      gsap.set(splits.map((s) => s.chars), { yPercent: 115 });
      gsap.set(clips, { clipPath: "inset(100% 0% 0% 0%)" });
      clips.forEach((c) => { (c as HTMLElement).tabIndex = -1; });

      // Arrival: as the section slides up over the leaving hero, the reel fades in and the first job writes itself on.
      const intro = gsap.timeline({ defaults: { ease: "none" } });
      intro.to(q(".do-reel, .do-tabs"), { autoAlpha: 1, duration: 0.3 }, 0)
        .to(clips[0], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: motion.easeOut }, 0.1)
        .fromTo(clips[0].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 0.9, ease: motion.easeOut }, 0.1)
        .to(splits[0].chars, { yPercent: 0, duration: 0.7, stagger: 0.03, ease: motion.easeOut }, 0.25);
      let now = -1;
      const mark = (i: number) => {
        if (i === now) return;
        now = i;
        tabs.forEach((t, k) => { t.classList.toggle("on", k === i); t.setAttribute("aria-current", k === i ? "true" : "false"); });
        clips.forEach((c, k) => { c.classList.toggle("on", k === i); c.tabIndex = k === i ? 0 : -1; }); // keyboard focus only reaches the clip on screen
      };
      const arrive = ScrollTrigger.create({ animation: intro, trigger: root.current, start: "top 92%", end: "top top", scrub: true, invalidateOnRefresh: true,
        onUpdate: (self) => { if (self.progress < 1) mark(self.progress > 0.55 ? 0 : -1); } });

      // The pin: each later job takes the screen in turn.
      const at = (i: number) => 0.3 + (i - 1) * motion.doStepGap;
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      jobs.forEach((_, i) => {
        if (i === 0) return;
        const out = at(i) - 0.15, n = splits[i - 1].chars.length;
        tl.to(splits[i - 1].chars, { yPercent: -140, duration: motion.doStepOut, stagger: 0.02, ease: "power2.in" }, out)
          .set(words[i - 1], { autoAlpha: 0 }, out + motion.doStepOut + 0.02 * (n - 1) + 0.02)
          .set(words[i], { autoAlpha: 1 }, at(i) + 0.05)
          .to(clips[i], { clipPath: "inset(0% 0% 0% 0%)", duration: motion.doStepIn, ease: motion.easeOut }, at(i) - 0.1)
          .fromTo(clips[i].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: motion.doStepIn + 0.3, ease: motion.easeOut }, at(i) - 0.1)
          .to(splits[i].chars, { yPercent: 0, duration: motion.doStepIn, stagger: 0.03, ease: motion.easeOut }, at(i) + 0.1);
      });
      const end = at(jobs.length - 1) + motion.doStepGap;
      tl.to(q(".do-cta"), { autoAlpha: 1, duration: 0.4 }, end - 0.7).to({}, { duration: 0.4 }, end - 0.4);
      const st = ScrollTrigger.create({
        animation: tl, trigger: root.current, start: "top top", end: () => `+=${innerHeight * motion.doScroll}`, pin: true, scrub: true, invalidateOnRefresh: true,
        onUpdate: () => { const t = tl.time(); mark(t < at(1) - 0.1 ? 0 : Math.min(jobs.length - 1, Math.floor((t - at(1) + 0.1) / motion.doStepGap) + 1)); },
      });
      jump.current = (i) => {
        const y = i === 0 ? arrive.end : st.start + ((at(i) + 0.6) / tl.duration()) * (st.end - st.start), lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: "smooth" });
      };
      return () => splits.forEach((s) => s.revert());
    }, root);
    document.fonts.ready.then(() => ScrollTrigger.refresh()); // the headline fonts change the height above this pin
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="do" id="make" aria-labelledby="do-h" data-paint="var(--paper)" data-ink="var(--black)">
      <h2 className="sr-only" id="do-h">{site.make.heading}</h2>
      <div className="do-stage">
        <div className="do-reel">
          <ul className="do-words">{jobs.map((j) => <li key={j.name} className="do-word">{j.name}</li>)}</ul>
          <div className="do-clips">
            {jobs.map((j, i) => j.p && (
              <a key={j.name} className="do-clip" href={`#work/${j.p.slug}`} style={{ "--tilt": i % 2 ? "2deg" : "-2deg" } as React.CSSProperties}
                onClick={(e) => { e.preventDefault(); onOpen(j.p!.slug); }} data-cursor="open" aria-label={`${site.make.open} ${j.p.name}`}>
                <img src={j.p.media.poster} alt="" width={960} height={540} decoding="async" />
              </a>
            ))}
          </div>
        </div>
        <ul className="do-tabs" aria-label={site.make.heading}>
          {jobs.map((j, i) => <li key={j.name}><button type="button" className="do-tab" onClick={() => jump.current(i)}>{j.name}</button></li>)}
        </ul>
        <div className="do-cta"><Button href={mailto} onClick={startProject} data-cursor="write">{site.nav.cta}</Button></div>
      </div>
    </section>
  );
}
