// Every duration, ease and distance in one place (seconds, GSAP eases).
export const motion = {
  leaderSweep: 0.45, // one number of the 3-2-1 countdown
  leaderFade: 0.35,
  nameIn: 1.1,
  nameStagger: 0.045,
  fadeIn: 0.8,
  stripSnap: 0.7,
  stripFling: 0.9,
  stripIdleMs: 5000, // wait before the strip advances by itself
  stripStepMs: 4200,
  pageColour: 0.7, // background change between scenes
  sceneName: 1.1,
  sceneStagger: 0.04,
  overlayIn: 0.6,
  overlayOut: 0.4,
  cutIn: 0.85, // match cut: a clip grows from its place on the page into the project overlay
  cutOut: 0.6,
  cutEase: "power4.inOut",
  cutFade: 0.3, // reduced motion: the overlay fades instead
  // 404: the zero that missed its mark
  // hero
  markAt: 0.3, // opening logo: the black square appears
  markP: 0.8, // the p builds
  markSlash: 1.3, // the slash blinks three times
  markOn: 0.25,
  markOff: 0.2,
  markSign: 2.3, // the name is written under it
  markSignDuration: 1.7, // so the whole sequence ends at 4.0s, before the idle auto-open below
  markShift: 0.5, // the mark glides up to make room for the name
  nfZoom: 1.12, // the 404 number starts this much bigger and settles
  nfIn: 1.1,
  nfDrift: 28, // px the 404 number drifts against the pointer
  cardIn: 0.45, // the Start a project card
  cardOut: 0.2,
  idleOpenMs: 4500, // a visitor who hasn't scrolled, tapped or typed gets the opening anyway
  idleOpenScroll: 1.8, // seconds the page glides through the opening on desktop
  typeSpeed: 55, // ms per letter
  eraseSpeed: 22,
  typeHoldFirst: 2600, // ms the question stays before the examples start
  typeHold: 1700,
  sceneArc: 0.14, // how curved a scene's top edge is as it arrives, as a share of the screen height
  sceneRecede: 0.94, // the scene underneath shrinks to this as the next one covers it
  sceneDim: 0.45,
  skewMax: 4, // degrees of tilt on the scene clips at full scroll speed
  skewPerVelocity: 0.12,
  sweep: 0.9, // next-project arch sweep
  lenisLerp: 0.07, // smooth-scroll weight: lower is heavier and smoother
  rainSpeed: 90, // px per second the opening letter-rain falls
  doScroll: 2.3, // screens of scroll the jobs section stays pinned
  doStepIn: 0.7, // a job word rising in
  doStepOut: 0.45,
  doStepGap: 1.05, // scroll time given to each job
  easeOut: "expo.out",
  easeSoft: "power3.out",
} as const;

/**
 * Owner's decision (2026-10-28): motion always plays, whatever the device's reduced-motion setting says.
 * Set to true to honour the setting again (the matching CSS rules are archived in explore/old-hero/reduced-motion.css).
 */
export const RESPECT_REDUCED_MOTION = false;
export const reduceMotion = () => RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
