import type { MouseEvent } from "react";
import { site } from "../content/site";

/** A Gmail compose window with your address and subject filled in: works with no mail app set up. */
export const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(site.contact.mailSubject)}`;

export const OPEN_CONTACT = "phatlines:contact";
/** Open the contact card from anywhere. */
export const openContact = () => dispatchEvent(new Event(OPEN_CONTACT));

/**
 * onClick for every "Start a project" link. A mailto: link does nothing when the visitor has no mail app, so the click opens the card instead.
 * The link keeps its mailto: address, which still works with JavaScript off, and a new-tab click is left alone.
 */
export const startProject = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  openContact();
};
