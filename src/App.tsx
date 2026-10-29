import { useCallback, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./content/site";
import { motion, reduceMotion } from "./lib/motion";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useHashRoute } from "./hooks/useHashRoute";
import { Cursor } from "./components/Cursor";
import { Grain } from "./components/Grain";
import { Backdrop } from "./components/Backdrop";
import { ProjectOverlay } from "./components/ProjectOverlay";
import { ContactCard } from "./components/ContactCard";
import { TopBar } from "./sections/TopBar";
import { Hero } from "./sections/Hero";
import { Work } from "./sections/Work";
import { Make } from "./sections/Make";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";

gsap.registerPlugin(ScrollTrigger);

const SEEN = "phatlines-leader-seen";
const seenLeader = () => { try { return sessionStorage.getItem(SEEN) === "1"; } catch { return false; } };
const playLeader = !reduceMotion() && !seenLeader() && !new URLSearchParams(location.search).has("nointro") && !location.hash.startsWith("#work/");

/** Resolve "var(--black)" to its colour so GSAP can tween it. */
const colour = (v: string) => (v.startsWith("var(") ? getComputedStyle(document.documentElement).getPropertyValue(v.slice(4, -1)).trim() : v);

export function App() {
  useSmoothScroll();
  const { slug, open, close } = useHashRoute();
  const onSeen = useCallback(() => {
    try { sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: the opening just plays again next time */ }
  }, []);

  // The page takes the colour of whatever section is in the middle of the screen.
  useLayoutEffect(() => {
    let leadIn = 0; // 0 to 1: how far the page has faded toward a data-paint-early section (see below)
    const paint = (el: HTMLElement) => {
      const bg = colour(el.dataset.paint!), ink = colour(el.dataset.ink!), duration = reduceMotion() ? 0 : motion.pageColour;
      // While the lead-in is running, only the section it leads into may change the page colour; an older section's timed fade would fight it.
      if (leadIn === 0 || el.dataset.paintEarly !== undefined) gsap.to(document.body, { backgroundColor: bg, color: ink, duration, ease: "power2.out", overwrite: true });
      gsap.set(document.documentElement, { "--page": bg, "--page-ink": ink }); // the bar switches at once: a blend would flash grey
    };
    const triggers = gsap.utils.toArray<HTMLElement>("[data-paint]").map((el) =>
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 45%", onEnter: () => paint(el), onEnterBack: () => paint(el) }));
    // A section with data-paint-early="start,end" fades the page into its colour by scroll position, finishing before the section's arch appears,
    // so the arch never floats over the wrong colour however fast you scroll (a timed fade can lag behind a quick scroll).
    const paints = gsap.utils.toArray<HTMLElement>("[data-paint]");
    const early = gsap.utils.toArray<HTMLElement>("[data-paint-early]").map((el) => {
      const before = paints[paints.indexOf(el) - 1], [start, end] = el.dataset.paintEarly!.split(",");
      return ScrollTrigger.create({
        trigger: el, start, end, scrub: true,
        onUpdate: (self) => {
          leadIn = self.progress;
          if (leadIn > 0) gsap.killTweensOf(document.body, "backgroundColor"); // a fade started a moment ago by a fast scroll
          document.body.style.backgroundColor = gsap.utils.interpolate(colour(before.dataset.paint!), colour(el.dataset.paint!), self.progress);
        },
      });
    });
    ScrollTrigger.refresh();
    return () => [...triggers, ...early].forEach((t) => t.kill());
  }, []);

  return (
    <>
      <a className="skip" href="#work">{site.nav.skip}</a>
      <Backdrop />
      <TopBar />
      <main id="top" inert={slug ? true : undefined}>
        <Hero playing={playLeader} onSeen={onSeen} onOpen={open} />
        <Work onOpen={open} ready />
        <Make onOpen={open} />
        <About />
        <Contact />
      </main>
      {slug && <ProjectOverlay key={slug} slug={slug} onClose={close} onOpen={open} />}
      <ContactCard />
      <Cursor />
      <Grain />
    </>
  );
}
