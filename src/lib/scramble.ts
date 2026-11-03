import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { motion, reduceMotion } from "./motion";

gsap.registerPlugin(ScrambleTextPlugin);

/** The glyphs a label runs through before it resolves: code, not noise. Letters and digits only, so Prox Yo draws them all. */
const CODE = "01ABCDEFHKMNPRSTVXYZ#$&";

/** Resolve `el` to `text` through code glyphs. Reduced motion just sets the text. */
export function scramble(el: HTMLElement, text: string, duration: number = motion.scramble) {
  if (reduceMotion()) { el.textContent = text; return; }
  gsap.to(el, { duration, overwrite: true, scrambleText: { text, chars: CODE, speed: 1.2, revealDelay: duration * 0.25 } });
}
