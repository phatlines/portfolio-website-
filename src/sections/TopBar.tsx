import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { site } from "../content/site";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";

/** The label rolls up and a copy rolls in from below on hover. */
const Roll = ({ children }: { children: string }) => <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>;

/** The top bar. On the 404 page `home` points every link back to the home page, since its sections are not on the page. */
export function TopBar({ home = false }: { home?: boolean }) {
  const to = home ? "/" : "";
  // The bar gets its frosted backing once the hero has scrolled away.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > innerHeight * 0.8); // after the first project's colour has risen over the hero
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  // Which of the two sections is on screen, so its link carries a short underline.
  const [here, setHere] = useState("");
  useEffect(() => {
    const els = ["work", "about"].map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (home || !els.length) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setHere(e.target.id); else setHere((h) => (h === e.target.id ? "" : h)); }), { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [home]);
  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <a className="nav-mark" href={home ? "/" : "#top"}><Logo className="nav-logo" />{site.name}</a>
      <nav aria-label="Main">
        <a href={`${to}#work`} aria-current={here === "work" ? "true" : undefined}><Roll>{site.nav.work}</Roll></a>
        <a href={`${to}#about`} aria-current={here === "about" ? "true" : undefined}><Roll>{site.nav.about}</Roll></a>
        <a className="nav-contact" href={`${to}#contact`}>{site.nav.contact}</a>
        <a className="nav-cta" href={mailto} onClick={startProject} data-cursor="write">{site.nav.cta}</a>
      </nav>
    </header>
  );
}
