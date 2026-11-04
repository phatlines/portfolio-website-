import { useEffect, useState } from "react";
import { motion } from "../lib/motion";
import { isPaused } from "../lib/pause";

/**
 * A word that types itself in a box, deletes, and types the next one (the hero's job title, the footer's "your next …").
 * The box is as wide as the longest word so the line never reflows while it types. Screen readers get the plain list.
 */
export function Typer({ words }: { words: readonly string[] }) {
  const [text, setText] = useState(words[0]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
  useEffect(() => {
    let i = 0, n = words[0].length, del = false, t: ReturnType<typeof setTimeout>;
    const step = () => {
      if (isPaused()) { t = setTimeout(step, 300); return; } // paused by the visitor: hold the word
      if (!del && n === words[i].length) { del = true; t = setTimeout(step, motion.roleHold); return; }
      if (del && n === 0) { del = false; i = (i + 1) % words.length; }
      n += del ? -1 : 1;
      setText(words[i].slice(0, n));
      t = setTimeout(step, del ? motion.roleErase : motion.roleType);
    };
    t = setTimeout(step, motion.roleHold);
    return () => clearTimeout(t);
  }, [words]);
  return (
    <span className="role">
      <span className="sr-only">{words.join(", ")}</span>
      <span className="role-size" aria-hidden="true">{longest}</span>
      <span className="role-text" aria-hidden="true">{text}<i className="role-caret" /></span>
    </span>
  );
}
