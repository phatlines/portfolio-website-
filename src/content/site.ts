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
    status: "Available for work",
    line: "Available for work.",
    months: [
      { m: "Nov", state: "open", note: "Open" },
      { m: "Dec", state: "open", note: "Open" },
      { m: "Jan", state: "ask", note: "Ask" },
      { m: "Feb", state: "ask", note: "Ask" },
      { m: "Mar", state: "ask", note: "Ask" },
      { m: "Apr", state: "ask", note: "Ask" },
    ],
  },

  nav: {
    work: "Work", process: "Process", resume: "Resume", journal: "Journal", contact: "Contact",
    cta: "Start a project", skip: "Skip to the work", menuOpen: "Open menu", menuClose: "Close menu", main: "Main",
  },

  // The opening: the page builds like a project. Each line ticks off when its files have really loaded.
  loader: {
    cmd: "phatlines@1.1 build",
    steps: [
      { name: "fonts", detail: "prox yo, josefin" },
      { name: "work", detail: "8 projects" },
      { name: "resume", detail: "1+ year" },
    ],
    ready: "ready in",
    skip: "Tap or press any key to skip",
  },

  hero: {
    heading: "I build websites and apps.",
    roles: ["Software engineer", "Motion designer", "Web designer", "iOS developer"], // typed in turn in the box beside my name
    // The hero is an editor window: these are its chrome, not content.
    ide: { title: "phatlines — portfolio", explorer: "Explorer", folder: "portfolio", file: "hero.tsx", branch: "main", meta: ["Ln 1, Col 1", "UTF-8", "TypeScript React"] },
    lead: "Websites, web apps, iOS and Mac apps, designed and built end to end.",
    secondary: "See the work",
    resume: "Resume",
  },

  work: {
    heading: "Featured Work",
    count: "7 project built so far · 1 side project",
    dragHint: "Drag the windows around",
    question: "What are you building today?",
    all: "All",
    chips: [
      { label: "Website", query: "website" },
      { label: "Web app", query: "web app" },
      { label: "iOS + Android", query: "ios android" },
      { label: "Mac app", query: "mac app" },
    ],
    noMatch: "Not existing yet. Here's everything I've built.",
    role: "Role", stack: "Stack", view: "View project", live: "Live site",
    moreHeading: "More work",
    sideHeading: "Side projects",
    hire: "Like what you see? Let's build yours.",
    open: "Open", // + the project name, read out by screen readers only
  },

  process: {
    heading: "From your brief to launch",
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
    stat: "2 years of shipping websites and apps",
    paragraphs: [
      "Muyiwa is a software engineer based in the United Kingdom.",
      "We work end to end: you bring the brief, I design and build it, and we review it together until it's right.",
    ],
    rolesHeading: "Roles",
    filmsNote: "We also make motion films on the side, which is where the care for interface motion comes from.",
    experienceHeading: "Experience",
    experience: [ // placeholders after the first row: edit these
      { when: "2024 – now", role: "Software engineer, freelance", where: "phatlines", what: "Websites, web apps, iOS and Mac apps for founders, studios and small businesses" },
    ],
    stackHeading: "Stack",
    stackNote: "used in shipped projects",
    github: "Click here to check some public repos of some of our projects.",
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
    big: "Let's build",
    next: "your next", // + one of the words below, typed in turn in a box
    nextWords: ["project", "website", "iOS app", "Web app", "motion graphics"],
    mailSubject: "New project",
    line: "Tell me what you're making. we will reply within two working days.",
    emailLabel: "Email",
    copy: "Copy email",
    copied: "Copied",
    copyFailed: "Couldn't copy. The address is phatlines@proton.me",
    follow: "Follow",
    open: "Open",
    // The "New commit" card: the visitor writes their enquiry as a commit, and it opens their email filled in.
    card: {
      title: "New Project",
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
    // The 404 is the hero's editor after a failed build: these are its chrome.
    ide: {
      title: "phatlines — build failed", file: "router.tsx", files: ["hero.tsx", "work.tsx", "router.tsx", "resume.tsx", "contact.tsx"],
      problems: "Problems", output: "Output", terminal: "Terminal", failed: "Failed to compile.",
    },
  },

  // The Journal page (journal.html): not open yet.
  journal: {
    title: "Journal · phatlines",
    heading: "Coming soon",
    body: "This is where I will put my blogs and resources. Kindly check back later.",
    back: "Back to the start",
  },
};
