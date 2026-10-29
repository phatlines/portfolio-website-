import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { site } from "../content/site";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";

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
  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <a className="nav-mark" href={home ? "/" : "#top"}><Logo className="nav-logo" />{site.name}</a>
      <nav aria-label="Main">
        <a href={`${to}#work`}>{site.nav.work}</a>
        <a href={`${to}#about`}>{site.nav.about}</a>
        <a className="nav-contact" href={`${to}#contact`}>{site.nav.contact}</a>
        <a className="nav-cta" href={mailto} onClick={startProject} data-cursor="write">{site.nav.cta}</a>
      </nav>
    </header>
  );
}
