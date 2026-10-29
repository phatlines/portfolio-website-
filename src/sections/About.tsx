import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { site } from "../content/site";
import { SectionHeading } from "../components/SectionHeading";
import { Signature } from "../components/Signature";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function About() {
  const body = useRef<HTMLDivElement>(null);

  // Reading marker: as you scroll, the words light up in order, from the first word to the last.
  // Words not read yet are dim, the word being read carries a small slash-shaped underline, and scrolling back up un-reads them.
  useLayoutEffect(() => {
    const paras = gsap.utils.toArray<HTMLElement>("p", body.current!);
    const splits = paras.map((p) => SplitText.create(p, { type: "words", wordsClass: "rw" }));
    const words = splits.flatMap((s) => s.words as HTMLElement[]);
    const last = words.length - 1;
    let at = -2; // the word being read; -1 means none yet, last + 1 means all read
    const show = (i: number) => {
      if (i === at) return;
      at = i;
      words.forEach((w, k) => { w.classList.toggle("read", k < i); w.classList.toggle("now", k === i); });
    };
    show(-1);
    const st = ScrollTrigger.create({
      trigger: paras[0], start: "top 78%", endTrigger: paras[paras.length - 1], end: "bottom 58%",
      onUpdate: (self) => show(self.progress >= 1 ? last + 1 : Math.floor(self.progress * (last + 1))),
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { st.kill(); splits.forEach((s) => s.revert()); };
  }, []);

  return (
    <section className="about" id="about" aria-labelledby="about-h" data-paint="var(--black)" data-ink="var(--paper)">
      <SectionHeading id="about-h">{site.about.heading}</SectionHeading>
      <div className="about-body" ref={body}>
        {site.about.paragraphs.map((t, i) => <p key={i}>{t}</p>)}
        <Signature name={site.person} label={site.about.signatureLabel} />
      </div>
    </section>
  );
}
