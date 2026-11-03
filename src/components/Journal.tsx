import { useRef, useState } from "react";
import { site } from "../content/site";
import { motion } from "../lib/motion";
import { scramble } from "../lib/scramble";

/** The Journal isn't open yet: a click resolves the label to "Coming soon", holds it, then resolves back. Screen readers hear it once. */
export function Journal({ className = "" }: { className?: string }) {
  const label = useRef<HTMLSpanElement>(null), busy = useRef(false);
  const [said, setSaid] = useState("");
  const onClick = () => {
    const el = label.current;
    if (!el || busy.current) return;
    busy.current = true;
    setSaid(`${site.nav.journal}: ${site.nav.journalSoon}`);
    scramble(el, site.nav.journalSoon);
    setTimeout(() => { scramble(el, site.nav.journal); busy.current = false; setSaid(""); }, (motion.scramble + motion.journalHold) * 1000);
  };
  return (
    <button type="button" className={`journal ${className}`} onClick={onClick}>
      <span ref={label}>{site.nav.journal}</span>
      <span className="sr-only" aria-live="polite">{said}</span>
    </button>
  );
}
