import { useState } from "react";
import { site } from "../content/site";
import { MailIcon, XIcon, ArrowIcon } from "../components/Icons";
import { mailto } from "../lib/mailto";

/** The last screen: one big email action that says what it does, the contact rows, and the footer. */
export function Contact() {
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopy("done"); }
    catch { setCopy("failed"); }
    setTimeout(() => setCopy("idle"), 2400);
  };
  return (
    <section className="contact" id="contact" aria-labelledby="contact-h" data-paint="var(--black)" data-ink="var(--paper)">
      <h2 className="sr-only" id="contact-h">{site.contact.heading}</h2>

      <a className="cta-mail" href={mailto} data-cursor="email" aria-label={`${site.contact.big}: email ${site.email}`}>
        <span className="contact-big" aria-hidden="true">
          {site.contact.big.split("").map((c, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{c === " " ? " " : c}</span>)}
        </span>
        <span className="cta-cue" aria-hidden="true">
          <span className="cta-cue-icon"><MailIcon /></span>
          <span className="cta-cue-text"><b>{site.email}</b><small>{site.contact.cue}</small></span>
          <span className="cta-cue-arrow"><ArrowIcon /></span>
        </span>
      </a>
      <p className="contact-line">{site.contact.line}</p>

      <ul className="links">
        <li className="link-row">
          <span className="link-label"><MailIcon /> {site.contact.emailLabel}</span>
          <a className="link-main" href={mailto}>{site.email}</a>
          <button type="button" className="copy" onClick={onCopy}>{copy === "done" ? site.contact.copied : site.contact.copy}</button>
        </li>
        <li className="link-row">
          <span className="link-label"><XIcon /> {site.contact.socialLabel}</span>
          <a className="link-main" href={site.social.url} target="_blank" rel="noreferrer">{site.contact.socialHandle}</a>
          <a className="link-side" href={site.social.url} target="_blank" rel="noreferrer" aria-label={`${site.contact.follow} ${site.contact.socialHandle} on X`}>
            {site.contact.follow} <ArrowIcon />
          </a>
        </li>
      </ul>
      <p className="copy-status" role="status">{copy === "failed" ? site.contact.copyFailed : copy === "done" ? site.contact.copied : ""}</p>

      <footer className="footer">
        <span>{site.footer}</span>
        <a href="#top">{site.contact.backToTop} <ArrowIcon up /></a>
      </footer>
    </section>
  );
}
