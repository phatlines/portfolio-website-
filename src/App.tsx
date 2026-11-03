import { useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./content/site";
import { reduceMotion } from "./lib/motion";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useHashRoute } from "./hooks/useHashRoute";
import { useDotLight } from "./hooks/useDotLight";
import { ProjectOverlay } from "./components/ProjectOverlay";
import { ContactCard } from "./components/ContactCard";
import { BuildLoader } from "./components/BuildLoader";
import { TopBar } from "./sections/TopBar";
import { Hero } from "./sections/Hero";
import { Work } from "./sections/Work";
import { Process } from "./sections/Process";
import { About } from "./sections/About";
import { Availability } from "./sections/Availability";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

gsap.registerPlugin(ScrollTrigger);
// Images and fonts change the page height after the first layout: measure the scroll animations again once everything has loaded.
addEventListener("load", () => ScrollTrigger.refresh());
document.fonts.ready.then(() => ScrollTrigger.refresh());

const SEEN = "phatlines-build-seen";
const seen = () => { try { return sessionStorage.getItem(SEEN) === "1"; } catch { return false; } };
// The build plays once per session, and never over a shared project link or with ?nointro.
const playBuild = !reduceMotion() && !seen() && !new URLSearchParams(location.search).has("nointro") && !location.hash.startsWith("#work/");

export function App() {
  useSmoothScroll();
  useDotLight();
  const { slug, open, close } = useHashRoute();
  const [ready, setReady] = useState(!playBuild);
  const onBuilt = useCallback(() => {
    try { sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: the build just plays again next time */ }
    setReady(true);
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <a className="skip" href="#work">{site.nav.skip}</a>
      <div className="dots" aria-hidden="true" />
      {!ready && <BuildLoader onDone={onBuilt} />}
      <TopBar />
      <main inert={slug ? true : undefined}>
        <Hero ready={ready} />
        <Work onOpen={open} />
        <Process onOpen={open} />
        <About />
        <Availability />
        <Contact />
      </main>
      <Footer />
      {slug && <ProjectOverlay key={slug} slug={slug} onClose={close} onOpen={open} />}
      <ContactCard />
    </>
  );
}
