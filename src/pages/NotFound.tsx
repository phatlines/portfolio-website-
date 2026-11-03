import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { motion, reduceMotion } from "../lib/motion";
import { scramble } from "../lib/scramble";
import { TopBar } from "../sections/TopBar";
import { ContactCard } from "../components/ContactCard";

const copy = site.notFound;

/** The address they asked for, read in their own browser and never sent anywhere. Null when there is nothing worth showing. */
const askedFor = () => {
  try {
    const p = decodeURIComponent(location.pathname);
    if (p === "/" || /^\/404(\.html)?$/.test(p)) return null;
    return p.length > 48 ? `${p.slice(0, 47)}…` : p;
  } catch { return null; }
};

const suggestions = [
  { href: "/", label: copy.home },
  { href: "/#work", label: site.nav.work },
  { href: "/#resume", label: site.nav.resume },
  { href: "/#contact", label: site.nav.contact },
];

/** The 404 as a compiler error: the route that failed, a short stack trace, and "did you mean" links to real sections. */
export function NotFound() {
  const root = useRef<HTMLDivElement>(null);
  const path = askedFor();

  useLayoutEffect(() => {
    document.title = copy.title;
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const digits = root.current!.querySelector<HTMLElement>(".nf-404")!;
      digits.textContent = "000";
      scramble(digits, "404", 1.1);
      gsap.timeline()
        .from(".nf-trace li", { autoAlpha: 0, x: -8, stagger: 0.08, duration: 0.3 }, 0.1)
        .from(".nf-in", { autoAlpha: 0, y: 12, stagger: 0.07, duration: 0.6, ease: motion.easeSoft }, 0.45);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="nf">
      <TopBar home />
      <main className="nf-main">
        <ol className="nf-trace mono" aria-hidden="true">
          <li className="nf-err">{copy.error}</li>
          <li>&nbsp;&nbsp;at GET {path ?? "/"}</li>
          <li>&nbsp;&nbsp;at phatlines.router (main.tsx)</li>
        </ol>
        <p className="nf-404" aria-hidden="true">404</p>
        <h1 className="nf-h nf-in">{copy.heading}</h1>
        <p className="nf-path nf-in">{path ? <>{copy.path} <b className="mono">{path}</b></> : copy.noPath}</p>
        <nav className="nf-in" aria-label={copy.didYouMean}>
          <p className="nf-mean">{copy.didYouMean}</p>
          <ul className="nf-links">{suggestions.map((s) => <li key={s.href}><a className="btn btn-link" href={s.href}>{s.label}</a></li>)}</ul>
        </nav>
      </main>
      <ContactCard />
    </div>
  );
}
