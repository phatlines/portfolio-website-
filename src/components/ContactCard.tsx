import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { commitMessage, composeGmail, OPEN_CONTACT } from "../lib/contact";
import { composeMailto } from "../lib/mailto";
import { motion, reduceMotion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { Button } from "./Button";
import { CopyIcon } from "./Icons";

const c = site.contact.card;

/**
 * "Start a project" as a new commit. Pick a type and a timeline, write one line, and the preview shows it as a commit;
 * Commit and send opens your email app (or Gmail) with it written in. Every field is optional, and copying the address still works.
 * Grows out of the button that opened it; Esc, the Close button or a click outside closes it, and focus goes back to that button.
 */
export function ContactCard() {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const back = useRef<HTMLDivElement>(null), from = useRef<DOMRect | undefined>(undefined), opener = useRef<Element | null>(null), leaving = useRef(false);

  useEffect(() => {
    const on = (e: Event) => { opener.current = document.activeElement; from.current = (e as CustomEvent<DOMRect | undefined>).detail; leaving.current = false; setCopy("idle"); setOpen(true); };
    addEventListener(OPEN_CONTACT, on);
    return () => removeEventListener(OPEN_CONTACT, on);
  }, []);

  const close = useCallback(() => {
    const el = back.current;
    if (leaving.current || !el) return;
    leaving.current = true;
    gsap.to(el.querySelector(".cc-card"), { y: 16, autoAlpha: 0, duration: motion.cardOut, ease: "power2.in" });
    gsap.to(el, { autoAlpha: 0, duration: motion.cardOut, ease: "power2.in", onComplete: () => setOpen(false) });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const el = back.current!, card = el.querySelector<HTMLElement>(".cc-card")!;
    gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
    const r = from.current, end = card.getBoundingClientRect();
    if (r && !reduceMotion() && innerWidth > 600) {
      // Grow from the button: start at its box and open out to the card.
      gsap.fromTo(card, { x: r.left + r.width / 2 - (end.left + end.width / 2), y: r.top + r.height / 2 - (end.top + end.height / 2), scale: Math.max(0.2, r.width / end.width), autoAlpha: 0 },
        { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: motion.cardIn, ease: motion.easeOut });
    } else {
      gsap.fromTo(card, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: motion.cardIn, ease: motion.easeOut });
    }
    card.querySelector<HTMLElement>(".cc-first")?.focus({ preventScroll: true });
    document.documentElement.classList.add("card-open");
    getLenis()?.stop();
    // Capture phase: Esc and Tab belong to the card, even when a project page is open underneath.
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input")];
      const first = f[0], last = f[f.length - 1];
      e.stopPropagation();
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", key, true);
    return () => {
      removeEventListener("keydown", key, true);
      document.documentElement.classList.remove("card-open");
      if (!document.documentElement.classList.contains("overlay-open")) getLenis()?.start(); // a project page underneath keeps the page locked
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopy("done"); }
    catch { setCopy("failed"); }
    setTimeout(() => setCopy("idle"), 2400);
  };

  if (!open) return null;
  const { subject, body } = commitMessage(scope, timeline, message);
  return (
    <div className="cc" ref={back} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="cc-card" role="dialog" aria-modal="true" aria-labelledby="cc-h">
        <div className="cc-top">
          <h2 id="cc-h">{c.title}</h2>
          <button type="button" className="cc-x" onClick={close}>{site.overlay.close}</button>
        </div>
        <p className="cc-line">{site.contact.line}</p>

        <fieldset className="cc-field">
          <legend>{c.typeLabel}</legend>
          <div className="chips">{c.types.map((t, i) => (
            <button key={t.scope} type="button" className={`chip${i === 0 ? " cc-first" : ""}`} aria-pressed={scope === t.scope} onClick={() => setScope(scope === t.scope ? null : t.scope)}>{t.label}</button>
          ))}</div>
        </fieldset>
        <fieldset className="cc-field">
          <legend>{c.timelineLabel}</legend>
          <div className="chips">{c.timelines.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={timeline === t} onClick={() => setTimeline(timeline === t ? null : t)}>{t}</button>
          ))}</div>
        </fieldset>
        <label className="cc-field cc-msg">
          <span>{c.messageLabel}</span>
          <input type="text" value={message} maxLength={90} placeholder={c.messagePlaceholder} onChange={(e) => setMessage(e.target.value)} />
        </label>

        <pre className="cc-preview" aria-label={body}><code>
          <span className="cc-hash">{"> "}git commit -m</span>{"\n"}
          <span className="cc-subject">{subject}</span>{"\n"}
          {timeline && <><span className="cc-add">+ timeline: {timeline.toLowerCase()}</span>{"\n"}</>}
          <span className="cc-add">+ from: {c.from}</span>
        </code></pre>

        <div className="cc-actions">
          <Button href={composeMailto(subject, body)}>{c.send}</Button>
          <Button variant="secondary" href={composeGmail(subject, body)} target="_blank" rel="noreferrer">{c.gmail}</Button>
        </div>
        <div className="cc-email">
          <span className="mono">{site.email}</span>
          <button type="button" className="cc-copy" onClick={onCopy}><CopyIcon />{copy === "done" ? site.contact.copied : site.contact.copy}</button>
        </div>
        <p className="cc-status" role="status">{copy === "failed" ? site.contact.copyFailed : copy === "done" ? site.contact.copied : ""}</p>
      </div>
    </div>
  );
}
