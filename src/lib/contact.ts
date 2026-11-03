import type { MouseEvent } from "react";
import { site } from "../content/site";

const enc = encodeURIComponent;
/** A Gmail compose window with your address, a subject and an optional body: works with no mail app set up. */
export const composeGmail = (subject: string = site.contact.mailSubject, body = "") =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(site.email)}&su=${enc(subject)}${body ? `&body=${enc(body)}` : ""}`;
export const gmail = composeGmail();

export const OPEN_CONTACT = "phatlines:contact";
/** Open the contact card from anywhere. `from` is the box of the button that asked, so the card can grow out of it. */
export const openContact = (from?: DOMRect) => dispatchEvent(new CustomEvent<DOMRect | undefined>(OPEN_CONTACT, { detail: from }));

/**
 * onClick for every "Start a project" link. A mailto: link does nothing when the visitor has no mail app, so the click opens the card instead.
 * The link keeps its mailto: address, which still works with JavaScript off, and a new-tab click is left alone.
 */
export const startProject = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  openContact((e.currentTarget as Element).getBoundingClientRect());
};

/** The enquiry as a commit: `feat(website): a booking site for my studio`, with the timeline as an added line. */
export function commitMessage(scope: string | null, timeline: string | null, message: string) {
  const subject = `feat(${scope ?? "project"}): ${message.trim() || site.contact.card.fallbackMessage}`;
  const body = [subject, "", ...(timeline ? [`+ timeline: ${timeline.toLowerCase()}`] : []), `+ from: ${site.contact.card.from}`].join("\n");
  return { subject, body };
}

