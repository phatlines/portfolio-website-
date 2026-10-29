import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { motion } from "../lib/motion";
import { Signature } from "./Signature";

/**
 * The opening's title card, centred in the screen: the black square appears, the p builds, the slash blinks three times,
 * then the name is written under it by hand (the same pen as the About signature). Decorative: the headline names the site.
 * The shapes are the favicon's, drawn inline so each part can move; colours come from the tokens.
 */
export function OpeningLogo() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root), [group] = q(".ol-group"), [tile] = q(".ol-tile"), [stem] = q(".ol-stem"), [bowl] = q(".ol-bowl"), [slash] = q(".ol-slash"), [sig] = q(".ol-sig");
    const lift = (sig.getBoundingClientRect().height + group.getBoundingClientRect().height * 0.18) / 2; // half the name plus its gap, so the finished pair is centred
    const origin = { transformOrigin: "50% 50%" };
    gsap.set([stem, bowl, slash], { opacity: 0 });
    gsap.set(tile, { opacity: 0, scale: 0.6, ...origin });
    const tl = gsap.timeline();
    tl.to(tile, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, motion.markAt)
      .fromTo(stem, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: motion.easeOut }, motion.markP)
      .fromTo(bowl, { opacity: 0, scale: 0.7, ...origin }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, motion.markP + 0.15);
    // The slash blinks on and off three times and stays on.
    let at = motion.markSlash;
    for (let i = 0; i < 3; i++) { tl.set(slash, { opacity: 1 }, at); at += motion.markOn; if (i < 2) { tl.set(slash, { opacity: 0 }, at); at += motion.markOff; } }
    tl.to(group, { y: -lift, duration: motion.markShift, ease: "power3.inOut" }, motion.markSign - 0.1);
    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={root} className="opening-logo" aria-hidden="true">
      <div className="ol-group">
        <svg className="ol-mark" viewBox="0 0 256 256" focusable="false">
          <rect className="ol-tile" width="256" height="256" rx="56" />
          <g transform="translate(128 131) scale(.88) translate(-174 -123)">
            <g className="ol-p">
              <path className="ol-stem" d="M64 56H108V92H64ZM64 104H108V206H64Z" />
              <path className="ol-bowl" fillRule="evenodd" d="M134 56a56 56 0 1 1 0 112a56 56 0 1 1 0-112ZM138 88a24 24 0 1 0 0 48a24 24 0 1 0 0-48Z" />
            </g>
            <path className="ol-slash" d="M206 168H236L284 40H254Z" />
          </g>
        </svg>
        <Signature name={site.hero.signed} label={site.hero.signed} className="ol-sig" center width={1100} startAfter={motion.markSign} duration={motion.markSignDuration} />
      </div>
    </div>
  );
}
