import { useMemo, useRef, useState } from "react";
import { site } from "../content/site";
import { searchProjects } from "../lib/search";
import { findProject } from "../lib/projects";
import { reduceMotion } from "../lib/motion";
import { useTypedPrompt } from "../hooks/useTypedPrompt";
import { getLenis } from "../hooks/useSmoothScroll";
import { FilterChip } from "./FilterChip";
import { ArrowIcon } from "./Icons";

const hero = site.hero;
const lines = [hero.question, ...hero.examples];
const MAX = 3;
const starters = hero.suggest.map(findProject).filter((p) => p !== undefined);

/**
 * "What are you building today?" Types itself until you start; then finds your work as you type.
 * Enter opens the best match; no match scrolls to the work. Quick-pick chips do the same for people who don't type.
 */
export function PromptBar({ typing, onOpen }: { typing: boolean; onOpen: (slug: string) => void }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false); // the bar or anything in it has focus
  const typed = useRef<HTMLSpanElement>(null), list = useRef<HTMLUListElement>(null), input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProjects(q).slice(0, MAX), [q]);
  const asked = q.trim().length > 0;
  useTypedPrompt(typed, lines, typing, focus || asked);
  // Focused and empty: a few places to start. Typed: the matches.
  const shown = asked ? results : focus ? starters : [];

  const toWork = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo("#work");
    else document.getElementById("work")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asked) return;
    const first = list.current?.querySelector("a");
    if (first) first.click(); // a real click, so the project page grows out of the result
    else toWork();
  };
  // Tap the typed line: an example runs as a search; the question just focuses the bar.
  const tapTyped = () => {
    const i = Number(typed.current?.dataset.line ?? 0);
    if (i > 0) setQ(lines[i]); else input.current?.focus();
  };
  const go = (slug: string) => (e: React.MouseEvent) => { e.preventDefault(); onOpen(slug); };
  const arrows = (e: React.KeyboardEvent) => {
    const links = [...(list.current?.querySelectorAll("a") ?? [])];
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") { setQ(""); input.current?.focus(); return; }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" || !links.length) return;
    e.preventDefault();
    if (e.key === "ArrowDown") (links[at + 1] ?? links[0]).focus();
    else if (at <= 0) input.current?.focus();
    else links[at - 1].focus();
  };

  return (
    <form className="pb" role="search" action="#work" onSubmit={submit} onKeyDown={arrows}
      onFocus={() => setFocus(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}>
      <label htmlFor="pb-q" className="sr-only">{hero.question}</label>
      <div className="pb-field">
        <input id="pb-q" ref={input} type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search" aria-controls="pb-results" />
        {!asked && <span className="pb-typed" aria-hidden="true" onClick={tapTyped}><span ref={typed} /><i className="pb-caret" /></span>}
      </div>
      <div className="pb-row">
        <ul className="pb-chips" aria-label={hero.chipsLabel}>
          {hero.chips.map((c) => <li key={c.label}><FilterChip label={c.label} pressed={q === c.query} onClick={() => setQ(c.query)} /></li>)}
        </ul>
        <button type="submit" className="pb-send" aria-label={hero.send}><ArrowIcon up /></button>
      </div>
      <div className="pb-results" id="pb-results" aria-live="polite">
        {shown.length > 0 && (
          <>
            <p className="sr-only">{shown.length} {shown.length === 1 ? hero.match : hero.matches}</p>
            <ul ref={list} aria-label={asked ? hero.resultsLabel : hero.suggestedLabel}>
              {shown.map((p) => (
                <li key={p.slug}>
                  <a href={`#work/${p.slug}`} onClick={go(p.slug)} data-cursor="open"><b>{p.name}</b><span>{p.type}</span><ArrowIcon /></a>
                </li>
              ))}
            </ul>
          </>
        )}
        {asked && results.length === 0 && <p className="pb-none">{hero.noMatch}</p>}
      </div>
    </form>
  );
}
