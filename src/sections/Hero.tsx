import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { SECTIONS, sectionLabel } from "../lib/sections";
import { Button } from "../components/Button";
import { GitHubMark, XMark } from "../components/Icons";

gsap.registerPlugin(SplitText);

const roles = site.hero.roles;
const longest = roles.reduce((a, b) => (b.length > a.length ? b : a));

/** The job title types itself in a box, deletes, and types the next one. Screen readers get the plain list. */
function RoleTyper() {
  const [text, setText] = useState(roles[0]);
  useEffect(() => {
    let i = 0, n = roles[0].length, del = false, t: ReturnType<typeof setTimeout>;
    const step = () => {
      const word = roles[i];
      if (!del && n === word.length) { del = true; t = setTimeout(step, motion.roleHold); return; }
      if (del && n === 0) { del = false; i = (i + 1) % roles.length; }
      n += del ? -1 : 1;
      setText(roles[i].slice(0, n));
      t = setTimeout(step, del ? motion.roleErase : motion.roleType);
    };
    t = setTimeout(step, motion.roleHold);
    return () => clearTimeout(t);
  }, []);
  return (
    <span className="role">
      <span className="sr-only">{roles.join(", ")}</span>
      <span className="role-size" aria-hidden="true">{longest}</span>
      <span className="role-text" aria-hidden="true">{text}<i className="role-caret" /></span>
    </span>
  );
}

/**
 * The first screen as an editor window on the ink ground: the file tree links to the sections and hero.tsx holds who, what and the actions.
 * When the loader hands over (`ready`) the headline rises word by word.
 */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const ide = site.hero.ide;

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
      <div className="ide">
        <div className="ide-title" aria-hidden="true"><i /><i /><i /><span>{ide.title}</span></div>
        <div className="ide-body">
          <nav className="ide-tree" aria-label={ide.explorer}>
            <p className="ide-label" aria-hidden="true">{ide.explorer}</p>
            <p className="ide-folder" aria-hidden="true">{ide.folder}</p>
            <ul>
              <li><a className="ide-file on" href="#top" aria-current="true">{ide.file}</a></li>
              {SECTIONS.map((id) => <li key={id}><a className="ide-file" href={`#${id}`}>{sectionLabel[id].toLowerCase()}.tsx</a></li>)}
            </ul>
          </nav>
          <div className="ide-pane ide-code">
            <div className="ide-tabs" aria-hidden="true"><span className="on">{ide.file}</span></div>
            <div className="ide-editor">
              <span className="ide-gutter" aria-hidden="true">{Array.from({ length: 40 }, (_, i) => <span key={i}>{i + 1}</span>)}</span>
              <div className="hero-text">
                <p className="hero-facts hero-in"><span className="ide-cmt" aria-hidden="true">//</span>{site.person}<i>·</i><RoleTyper /><span className="hero-place"><i>·</i> {site.based}</span></p>
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
              </div>
            </div>
          </div>
        </div>
        <div className="ide-status">
          <span className="ide-branch" aria-hidden="true">⎇ {ide.branch}</span>
          <p className="hero-avail"><i className="dot" aria-hidden="true" />{site.availability.line}</p>
          <span className="ide-meta" aria-hidden="true">{ide.meta.map((m) => <span key={m}>{m}</span>)}</span>
        </div>
      </div>
    </section>
  );
}
