// Every word on the page that isn't project data. v1.1 wording: docs/v1.1/COPY.md (2026-11-03). Earlier approved copy is kept verbatim.
export const site = {
  name: "phatlines",
  person: "Muyiwa Adebayo",
  role: "Software engineer",
  based: "United Kingdom",
  email: "phatlines@proton.me",
  social: {
    x: { label: "X", handle: "@phatlines_", url: "https://x.com/phatlines_" },
    github: { label: "GitHub", handle: "/phatlines", url: "https://github.com/phatlines" },
  },

  // One source for availability: the nav dot, the hero line and the Availability section all read this.
  availability: {
    status: "Available now",
    line: "Available now. November and December open.",
    months: [
      { m: "Nov", state: "open", note: "All month" },
      { m: "Dec", state: "open", note: "Open" },
      { m: "Jan", state: "ask", note: "Ask" },
      { m: "Feb", state: "ask", note: "Ask" },
      { m: "Mar", state: "ask", note: "Ask" },
      { m: "Apr", state: "ask", note: "Ask" },
    ],
  },

  nav: {
    work: "Work", process: "Process", resume: "Resume", journal: "Journal", journalSoon: "Coming soon", contact: "Contact",
    cta: "Start a project", skip: "Skip to the work", menuOpen: "Open menu", menuClose: "Close menu", main: "Main",
  },

  // The opening: the page builds like a project. Each line ticks off when its files have really loaded.
  loader: {
    cmd: "phatlines@1.1 build",
    steps: [
      { name: "fonts", detail: "prox yo, hanken" },
      { name: "hero", detail: "portrait, colour" },
      { name: "work", detail: "8 projects" },
      { name: "resume", detail: "1+ year" },
    ],
    ready: "ready in",
    skip: "Tap or press any key to skip",
  },

  hero: {
    heading: "I build websites and apps.",
    lead: "Websites, web apps, iOS and Mac apps, designed and built end to end.",
    secondary: "See the work",
    resume: "Resume",
    photoAlt: "Muyiwa Adebayo looking up, in clear glasses and an M pendant",
    revealHint: "Move over the photo",
  },

  work: {
    heading: "Selected Work",
    count: "7 shipped in 2026 · 1 side project",
    question: "What are you building today?",
    all: "All",
    chips: [
      { label: "Website", query: "website" },
      { label: "Web app", query: "web app" },
      { label: "iOS + Android", query: "ios android" },
      { label: "Mac app", query: "mac app" },
    ],
    noMatch: "No exact match. Here's everything I've built.",
    role: "Role", stack: "Stack", view: "View project", live: "Live site",
    moreHeading: "More work",
    sideHeading: "Side projects",
    hire: "Like what you see? Let's make yours.",
    open: "Open", // + the project name, read out by screen readers only
  },

  process: {
    heading: "From brief to launch",
    sub: "How we'd work together",
    intro: "I work end to end: you bring the brief, I design and build it, and we review it together until it's right.",
    steps: [
      { name: "Brief", note: "you bring it" },
      { name: "Design", note: "screens and flows" },
      { name: "Build", note: "code, end to end" },
      { name: "Review", note: "until it's right" },
    ],
    jobs: [ // each job is shown next to the projects that prove it
      { name: "Websites", examples: ["spori"] },
      { name: "Landing pages", examples: ["african-skin-code"] },
      { name: "SaaS", examples: ["invoicely"] },
      { name: "iOS apps", examples: ["fitty"] },
      { name: "Mac apps", examples: ["kapture", "sorti"] },
    ],
  },

  about: {
    heading: "About and resume",
    stat: "1+ year shipping production websites and apps",
    paragraphs: [
      "phatlines is a software engineer based in the United Kingdom.",
      "I work end to end: you bring the brief, I design and build it, and we review it together until it's right.",
    ],
    rolesHeading: "Roles",
    filmsNote: "I also make motion films on the side, which is where the care for interface motion comes from.",
    experienceHeading: "Experience",
    experience: [ // placeholders after the first row: edit these
      { when: "2025 – now", role: "Software engineer, freelance", where: "phatlines", what: "Websites, web apps, iOS and Mac apps for founders, studios and small businesses" },
      { when: "[Year] – [Year]", role: "[Job title]", where: "[Company]", what: "[What you shipped and the result]" },
      { when: "[Year]", role: "[Course or certificate]", where: "[Institution]", what: "[Optional]" },
    ],
    stackHeading: "Stack",
    stackNote: "used in shipped projects",
    github: "Public repos and the code behind these projects.",
    githubCta: "Open GitHub",
  },

  availabilitySection: {
    heading: "Availability",
    lead: "Open to new projects with founders, studios and small businesses, in the UK and anywhere else.",
    options: [
      { name: "Freelance project", what: "A website, landing page, web app, iOS or Mac app. Fixed scope, design and build.", terms: "[2–6 weeks]", cta: "Start a project" },
      { name: "Contract", what: "Join your team as a front-end or full-stack engineer.", terms: "[2–5 days a week]", cta: "Ask about dates" },
      { name: "Full-time role", what: "Open to the right engineering role, in the UK or remote.", terms: "[Notice period]", cta: "See resume" },
    ],
  },

  contact: {
    heading: "Contact",
    big: "Start a project",
    mailSubject: "New project",
    line: "Tell me what you're making. I reply within two working days.",
    emailLabel: "Email",
    copy: "Copy email",
    copied: "Copied",
    copyFailed: "Couldn't copy. The address is phatlines@proton.me",
    follow: "Follow",
    open: "Open",
    // The "New commit" card: the visitor writes their enquiry as a commit, and it opens their email filled in.
    card: {
      title: "New commit",
      typeLabel: "Type",
      types: [{ label: "Website", scope: "website" }, { label: "Web app", scope: "web-app" }, { label: "iOS + Android", scope: "mobile" }, { label: "Mac app", scope: "mac" }],
      timelineLabel: "Timeline",
      timelines: ["This month", "Next month", "Later"],
      messageLabel: "Message",
      messagePlaceholder: "a booking site for my studio",
      fallbackMessage: "a new project",
      send: "Commit and send",
      gmail: "Open in Gmail",
      from: "you",
    },
    backToTop: "Back to top",
  },

  footer: {
    built: "Built by Muyiwa Adebayo with React, Vite and GSAP",
    deployed: "deployed",
    london: "London",
    rights: "© 2026 phatlines. All rights reserved.",
  },

  overlay: { close: "Close", next: "Next project", live: "Visit the live site", noLink: "Live link coming soon", builtWith: "Built with", role: "Role" },

  // The 404 page. Approved 2026-10-27; the error lines and "Did you mean" are v1.1.
  notFound: {
    title: "Page not found · phatlines",
    error: "Error: route not found",
    heading: "This page doesn't exist.",
    path: "Nothing at", // + the address they asked for
    noPath: "There's nothing at this address.",
    didYouMean: "Did you mean:",
    home: "Back to the start",
  },
};
