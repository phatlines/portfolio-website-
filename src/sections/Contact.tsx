import { useState } from "react";
import { site } from "../content/site";
import { mailto } from "../lib/mailto";
import { startProject } from "../lib/contact";
import { Button } from "../components/Button";
import { CopyIcon, GitHubMark, XMark } from "../components/Icons";

/** The ask: the big line opens the commit card, and every channel from the hero is repeated so nobody scrolls back up. */
export function Contact() {
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopy("done"); }
    catch { setCopy("failed"); }
    setTimeout(() => setCopy("idle"), 2400);
  };
  const s = site.social;
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-h">
      <h2 className="sr-only" id="contact-h">{site.contact.heading}</h2>
      <a className="contact-big" href={mailto} onClick={startProject}>
        {site.contact.big.split(" ").map((w, i) => <span key={i} className="cw" style={{ "--i": i } as React.CSSProperties}>{w}</span>)}
      </a>
      <p className="contact-line">{site.contact.line}</p>
      <ul className="rows">
        <li className="row">
          <span className="row-k">{site.contact.emailLabel}</span>
          <a className="row-v" href={mailto} onClick={startProject}>{site.email}</a>
          <Button variant="secondary" onClick={onCopy} icon={<CopyIcon />}>{copy === "done" ? site.contact.copied : site.contact.copy}</Button>
        </li>
        <li className="row">
          <span className="row-k"><XMark /> {s.x.label}</span>
          <a className="row-v" href={s.x.url} target="_blank" rel="noreferrer">{s.x.handle}</a>
          <Button variant="secondary" href={s.x.url} target="_blank" rel="noreferrer">{site.contact.follow}</Button>
        </li>
        <li className="row">
          <span className="row-k"><GitHubMark /> {s.github.label}</span>
          <a className="row-v" href={s.github.url} target="_blank" rel="noreferrer">github.com{s.github.handle}</a>
          <Button variant="secondary" href={s.github.url} target="_blank" rel="noreferrer">{site.contact.follow}</Button>
        </li>
      </ul>
      <p className="copy-status" role="status">{copy === "failed" ? site.contact.copyFailed : ""}</p>
    </section>
  );
}
