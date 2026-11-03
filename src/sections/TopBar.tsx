import { useEffect, useState } from "react";
import { site } from "../content/site";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { Button } from "../components/Button";
import { Journal } from "../components/Journal";
import { MobileMenu } from "../components/MobileMenu";
import { SECTIONS, sectionLabel } from "../lib/sections";


/** Which section is in the middle of the screen, so its link carries the green underline. */
function useHere(off: boolean) {
  const [here, setHere] = useState("");
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (off || !els.length) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setHere(e.target.id); else setHere((h) => (h === e.target.id ? "" : h)); }), { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [off]);
  return here;
}

/** The bar: wordmark, five links, availability and Start a project. Over the ink hero it is clear; past it, a white bar with a rule. On the 404 every link goes home first. */
export function TopBar({ home = false }: { home?: boolean }) {
  const to = home ? "/" : "";
  const [past, setPast] = useState(home);
  useEffect(() => {
    if (home) return;
    const on = () => setPast(scrollY > innerHeight - 72);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [home]);
  const here = useHere(home);
  return (
    <header className={`nav${past ? " past" : ""}`}>
      <a className="nav-mark" href={home ? "/" : "#top"}>{site.name}</a>
      <nav className="nav-links" aria-label={site.nav.main}>
        {SECTIONS.slice(0, 3).map((id) => <a key={id} className="nav-link" href={`${to}#${id}`} aria-current={here === id ? "true" : undefined}>{sectionLabel[id]}</a>)}
        <Journal className="nav-link" />
        <a className="nav-link" href={`${to}#contact`} aria-current={here === "contact" ? "true" : undefined}>{site.nav.contact}</a>
      </nav>
      <div className="nav-end">
        <span className="avail"><i className="dot" aria-hidden="true" />{site.availability.status}</span>
        <Button className="nav-cta" href={mailto} onClick={startProject}>{site.nav.cta}</Button>
        <MobileMenu here={here} to={to} />
      </div>
    </header>
  );
}
