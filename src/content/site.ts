// Every word on the page that isn't project data. Approved in COPY.md (2026-10-26).
import type { Media } from "./types";

/** An offer in What I make. `clip` overrides the linked project's own clip in that row. */
type Offer = { title: string; line: string; example: string; exampleLabel: string; clip?: Media };
export const site = {
  name: "phatlines",
  person: "Muyiwa Adebayo",
  email: "phatlines@proton.me",
  social: { label: "X / @phatlines_", url: "https://x.com/phatlines_" },

  nav: { work: "Work", about: "About", contact: "Contact", cta: "Start a project", skip: "Skip to the work" },

  // The hero: a headline and a finder for the work. Wording approved 2026-10-28.
  hero: {
    heading: "I build websites and apps.",
    question: "What are you building today?",
    examples: ["A website for my studio", "An iPhone app for my gym", "A Mac app that tidies my files"],
    chipsLabel: "Quick picks",
    chips: [
      { label: "Website", query: "website" },
      { label: "Web app", query: "web app" },
      { label: "iOS + Android", query: "ios android" },
      { label: "Mac app", query: "mac app" },
      { label: "Motion", query: "motion" },
    ],
    send: "Find my work",
    suggest: ["spori", "invoicely", "kapture"], // shown when the bar is focused and empty: a website, a web app, a Mac app
    suggestedLabel: "Work to start with", // read out by screen readers only
    peekLabel: "Featured work", // read out by screen readers only
    open: "Open", // + the project name, read out by screen readers only
    resultsLabel: "Matching projects",
    noMatch: "No exact match. Here's everything I've built.",
    match: "match",
    matches: "matches",
  },

  work: { heading: "Selected work", restHeading: "More work", sideHeading: "Side projects", sceneLabel: "Project" },

  make: {
    heading: "What I make",
    intro: "Two things, sometimes three: the product, the site that sells it, and, when you want one, a launch film.",
    offers: [
      { title: "Websites", line: "Marketing sites and portfolios that move. You bring the brief; I design and build it, with reviews together along the way.", example: "spori", exampleLabel: "See SPORI" },
      { title: "Apps", line: "Web, iPhone, Android and Mac apps, from the first screen to the build that ships.", example: "invoicely", exampleLabel: "See invoicely", clip: { kind: "video", src: "/media/invoicely-app.mp4", poster: "/media/invoicely-app.jpg", alt: "invoicely's late-payment calculator" } },
      { title: "Launch films", line: "Short films that show what your product does, cut for your site and your socials.", example: "invoicely", exampleLabel: "See the invoicely launch film", clip: { kind: "video", src: "/media/invoicely-film.mp4", poster: "/media/invoicely-film.jpg", alt: "The opening of the invoicely launch film" } },
    ] as Offer[],
  },

  about: {
    heading: "About",
    paragraphs: [
      "phatlines is a software engineer based in the United Kingdom. I also make motion films on the side.",
      "I work end to end: you bring the brief, I design and build it, and we review it together until it's right.",
      "Open to new projects with founders, studios and small businesses, in the UK and anywhere else.",
    ],
    signatureLabel: "Signed, Muyiwa Adebayo",
  },

  contact: {
    heading: "Contact",
    big: "Start a project",
    mailSubject: "New project",
    cue: "Opens your email app",
    line: "Tell me what you're making. I reply within two working days.",
    emailLabel: "Email",
    copy: "Copy email",
    copied: "Copied",
    copyFailed: "Couldn't copy. The address is phatlines@proton.me",
    socialLabel: "X (Twitter)",
    socialHandle: "@phatlines_",
    follow: "Follow",
    backToTop: "Back to top",
  },

  overlay: { close: "Close", next: "Next project", live: "Visit the live site", noLink: "Live link coming soon", builtWith: "Built with", role: "Role" },

  footer: "© 2026 phatlines. All rights reserved.",

  // The 404 page. Approved 2026-10-27.
  notFound: {
    title: "Scene missing · phatlines",
    slate: ["Reel 404", "Scene missing"],
    lost: { heading: "This scene didn't make the cut.", line: "The zero missed its mark. Drag it back into place." },
    found: { heading: "Found it.", line: "Now let's get you back to the work." },
    home: "Back to the start",
    open: "Open", // + the project name
    zeroLabel: "The zero. Drag it onto its mark, or press Enter to put it back",
    strip: "SCENE MISSING_",
  },
};
