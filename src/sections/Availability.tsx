import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../content/site";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { reduceMotion } from "../lib/motion";
import { Button } from "../components/Button";

gsap.registerPlugin(ScrollTrigger);
const s = site.availabilitySection;

/** The terms, right before the ask: three ways to work together and which months are open. Freelance first. */
export function Availability() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".opt", { y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: ".opts", start: "top 80%", once: true } });
      gsap.from(".month.open", { "--on": 0, duration: 0.4, stagger: 0.12, ease: "power2.out", scrollTrigger: { trigger: ".months", start: "top 90%", once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="avail-sec section" id="availability" ref={root} aria-labelledby="avail-h">
      <div className="sec-head">
        <h2 className="sec-h" id="avail-h">{s.heading}</h2>
        <span className="avail-status"><i className="dot" aria-hidden="true" />{site.availability.status}</span>
      </div>
      <p className="avail-lead">{s.lead}</p>
      <ul className="opts">
        {s.options.map((o, i) => (
          <li className="opt" key={o.name}>
            <b className="opt-name">{o.name}</b>
            <span className="opt-what">{o.what}</span>
            <span className="opt-terms mono">{o.terms}</span>
            {i === 2
              ? <Button variant="secondary" href="#resume">{o.cta}</Button>
              : <Button variant={i === 0 ? "primary" : "secondary"} href={mailto} onClick={startProject}>{o.cta}</Button>}
          </li>
        ))}
      </ul>
      <ol className="months" aria-label={site.availability.line}>
        {site.availability.months.map((m) => <li key={m.m} className={`month ${m.state}`}><b>{m.m}</b><span>{m.note}</span></li>)}
      </ol>
    </section>
  );
}
