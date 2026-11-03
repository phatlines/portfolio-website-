import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../content/site";
import { reel } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { Button } from "../components/Button";
import { GitHubMark } from "../components/Icons";

gsap.registerPlugin(ScrollTrigger);
const a = site.about;
const shipped = reel.filter((p) => p.group === "main");

/** Tools, counted across the shipped projects (not the side project), most used first. */
const stackCounts = () => {
  const n = new Map<string, number>();
  shipped.forEach((p) => p.stack.forEach((t) => n.set(t, (n.get(t) ?? 0) + 1)));
  return [...n].sort((x, y) => y[1] - x[1]);
};
/** Roles, counted across every live project. */
const roleCounts = () => {
  const n = new Map<string, number>();
  reel.forEach((p) => n.set(p.role, (n.get(p.role) ?? 0) + 1));
  return [...n];
};

/** The record recruiters look for: about, experience, a stack counted from the shipped work, roles and GitHub. No PDF: it's all here. */
export function About() {
  const root = useRef<HTMLElement>(null);
  const tools = stackCounts();

  // Rows arrive one by one; the stack counts tick up to their real number once.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".xp tr, .tools li", { y: 8, autoAlpha: 0, duration: motion.row, stagger: motion.rowStagger, ease: motion.easeSoft, scrollTrigger: { trigger: ".resume-body", start: "top 75%", once: true } });
      gsap.utils.toArray<HTMLElement>(".tools .n").forEach((el) => {
        const to = Number(el.textContent), o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, { v: to, duration: 0.6, ease: "power2.out", snap: { v: 1 }, onUpdate: () => { el.textContent = String(o.v); }, scrollTrigger: { trigger: ".tools", start: "top 85%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about section" id="resume" ref={root} aria-labelledby="about-h">
      <div className="sec-head">
        <h2 className="sec-h" id="about-h">{a.heading}</h2>
      </div>
      <p className="resume-stat">{a.stat}</p>
      <div className="resume-body">
        <div className="resume-side">
          {a.paragraphs.map((t) => <p className="resume-p" key={t}>{t}</p>)}
          <h3 className="sub-h">{a.rolesHeading}</h3>
          <table className="tbl"><tbody>{roleCounts().map(([r, n]) => <tr key={r}><td>{r}</td><td className="num">{n}</td></tr>)}</tbody></table>
          <p className="resume-note">{a.filmsNote}</p>
        </div>
        <div className="resume-main">
          <h3 className="sub-h">{a.experienceHeading}</h3>
          <table className="tbl xp">
            <tbody>{a.experience.map((x) => <tr key={x.when + x.role}><td className="mono">{x.when}</td><td><b>{x.role}</b><span>{x.where}</span></td><td className="muted">{x.what}</td></tr>)}</tbody>
          </table>
          <h3 className="sub-h">{a.stackHeading} <small>· {a.stackNote}</small></h3>
          <ul className="tools">{tools.map(([t, n]) => <li key={t}><b>{t}</b><span className="n">{n}</span></li>)}</ul>
          <div className="gh">
            <span className="gh-mark"><GitHubMark /></span>
            <p><b>{site.social.github.handle}</b> {a.github}</p>
            <Button variant="secondary" href={site.social.github.url} target="_blank" rel="noreferrer">{a.githubCta}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
