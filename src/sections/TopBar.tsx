import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { site } from "../content/site";

export function TopBar() {
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
      <a className="nav-mark" href="#top"><Logo className="nav-logo" />{site.name}</a>
      <nav aria-label="Main">
        <a href="#work">{site.nav.work}</a>
        <a href="#about">{site.nav.about}</a>
        <a className="nav-contact" href="#contact">{site.nav.contact}</a>
        <a className="nav-cta" href={`mailto:${site.email}`} data-cursor="write">{site.nav.cta}</a>
      </nav>
    </header>
  );
}
