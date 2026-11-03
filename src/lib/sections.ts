import { site } from "../content/site";

/** The page sections the nav links to, in order, with their labels. */
export const SECTIONS = ["work", "process", "resume", "contact"] as const;
export const sectionLabel = { work: site.nav.work, process: site.nav.process, resume: site.nav.resume, contact: site.nav.contact };
