import { site } from "../content/site";

/** The "Start a project" email link: your address with a subject line already filled in. */
export const mailto = `mailto:${site.email}?subject=${encodeURIComponent(site.contact.mailSubject)}`;
