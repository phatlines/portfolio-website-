import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { site } from "../content/site";
import { gmail, OPEN_CONTACT } from "../lib/contact";
import { mailto } from "../lib/mailto";
import { motion } from "../lib/motion";
import { getLenis } from "../hooks/useSmoothScroll";
import { Button } from "./Button";

const card = site.contact.card;

/**
 * "Start a project": your address, with ways to reach you that work for everyone. Copy needs nothing installed,
 * Gmail opens a compose window in the browser, and the email app link is there for people who have one.
 * Opened by openContact() from any Start a project button. Esc, the Close button or a click outside closes it.
 */
export function ContactCard() {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const back = useRef<HTMLDivElement>(null), opener = useRef<Element | null>(null), leaving = useRef(false);

  useEffect(() => {
    const on = () => { opener.current = document.activeElement; leaving.current = false; setCopy("idle"); setOpen(true); };
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
    const el = back.current!;
    gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
    gsap.fromTo(el.querySelector(".cc-card"), { y: 28, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: motion.cardIn, ease: motion.easeOut });
    el.querySelector<HTMLElement>(".cc-first")?.focus({ preventScroll: true });
    document.documentElement.classList.add("card-open");
    getLenis()?.stop();
    // Capture phase: Esc and Tab belong to the card, even when a project page is open underneath.
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
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
  return (
    <div className="cc" ref={back} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="cc-card" role="dialog" aria-modal="true" aria-labelledby="cc-h">
        <button type="button" className="cc-x" onClick={close}>{site.overlay.close}</button>
        <h2 id="cc-h">{site.nav.cta}</h2>
        <p className="cc-line">{site.contact.line}</p>
        <p className="cc-email">{site.email}</p>
        <div className="cc-actions">
          <button type="button" className="btn btn-ink cc-first" onClick={onCopy}>{copy === "done" ? site.contact.copied : site.contact.copy}</button>
          <Button variant="outline" href={mailto}>{card.openApp}</Button>
          <Button variant="outline" href={gmail} target="_blank" rel="noreferrer">{card.gmail}</Button>
          <Button variant="outline" href={site.social.url} target="_blank" rel="noreferrer">{card.x}</Button>
        </div>
        <p className="cc-status" role="status">{copy === "failed" ? site.contact.copyFailed : copy === "done" ? site.contact.copied : ""}</p>
      </div>
    </div>
  );
}
