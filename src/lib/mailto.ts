import { site } from "../content/site";

const enc = encodeURIComponent;

/** An email to you, with a subject (and an optional body) filled in. */
export const composeMailto = (subject: string = site.contact.mailSubject, body = "") =>
  `mailto:${site.email}?subject=${enc(subject)}${body ? `&body=${enc(body)}` : ""}`;

/** The "Start a project" email link: your address with a subject line already filled in. */
export const mailto = composeMailto();
