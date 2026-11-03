import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../content/site";
import { findProject } from "../lib/projects";
import { reduceMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * From brief to launch: four steps in a row, then a bus down to every kind of job, each wired to the shipped projects that prove it.
 * As you scroll, each link draws to the next step and fills it; Build fills green. Reduced motion shows the finished diagram.
 */
export function Process({ onOpen }: { onOpen: (slug: string) => void }) {
  const root = useRef<HTMLElement>(null);
  const p = site.process;

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".flow", start: "top 75%", end: "bottom 55%", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>(".flow-step").forEach((s, i) => {
        if (i > 0) tl.from(s.previousElementSibling!, { scaleX: 0, transformOrigin: "0 50%", duration: 0.5, ease: "none" });
        tl.from(s, { "--fill": 0, duration: 0.4, ease: "none" });
      });
      tl.from(".flow-bus", { scaleY: 0, transformOrigin: "50% 0", duration: 0.4, ease: "none" })
        .from(".flow-out", { y: 16, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: "none" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="process section" id="process" ref={root} aria-labelledby="process-h">
      <div className="sec-head">
        <h2 className="sec-h" id="process-h">{p.heading}</h2>
        <span className="sec-note">{p.sub}</span>
      </div>
      <div className="process-grid">
        <p className="process-intro">{p.intro}</p>
        <div className="flow">
          <ol className="flow-steps">
            {p.steps.map((s, i) => [
              i > 0 && <li key={`l${i}`} className="flow-link" aria-hidden="true" />,
              <li key={s.name} className={`flow-step${s.name === "Build" ? " key" : ""}`}><b>{s.name}</b><span>{s.note}</span></li>,
            ])}
          </ol>
          <i className="flow-bus" aria-hidden="true" />
          <ul className="flow-outs">
            {p.jobs.map((j) => {
              const proofs = j.examples.map(findProject).filter((x) => !!x);
              const first = proofs[0]!;
              return (
                <li key={j.name} className="flow-out">
                  <a href={`#work/${first.slug}`} onClick={(e) => { e.preventDefault(); onOpen(first.slug); }}>
                    <img src={first.media.poster} alt="" width={960} height={540} loading="lazy" />
                    <span><b>{j.name}</b><em>{proofs.map((x) => x!.name).join(", ")}</em></span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
