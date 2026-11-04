import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../content/site";
import { reel } from "../lib/projects";
import { motion, reduceMotion } from "../lib/motion";
import { Button } from "../components/Button";
import { GitHubMark } from "../components/Icons";
import { stack, ToolMark } from "../components/StackIcons";

gsap.registerPlugin(ScrollTrigger);
const a = site.about;

/** Roles, counted across every live project. */
const roleCounts = () => {
  const n = new Map<string, number>();
  reel.forEach((p) => n.set(p.role, (n.get(p.role) ?? 0) + 1));
  return [...n];
};

/** The record recruiters look for: about, experience, the stack as logos, roles and GitHub. No PDF: it's all here. */
export function About() {
  const root = useRef<HTMLElement>(null);

  // Rows arrive one by one.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".xp tr, .tools li", { y: 8, autoAlpha: 0, duration: motion.row, stagger: motion.rowStagger, ease: motion.easeSoft, scrollTrigger: { trigger: ".resume-body", start: "top 75%", once: true } });
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
          <h3 className="sub-h">{a.stackHeading}</h3>
          <ul className="tools">{stack.map((t) => <li key={t.name} style={t.brand ? { "--brand": t.brand } as React.CSSProperties : undefined}><ToolMark d={t.d} /><b>{t.name}</b></li>)}</ul>
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
