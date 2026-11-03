// Every duration, ease and distance in one place (seconds, GSAP eases).
export const motion = {
  easeOut: "expo.out",
  easeSoft: "power3.out",
  lenisLerp: 0.1, // smooth-scroll weight: an engineer's page shouldn't feel floaty
  // the build loader
  loaderMin: 0.9, // never flashes
  loaderMax: 2.4, // never holds the page longer than this
  // entrances
  words: 0.8,
  wordStagger: 0.06,
  row: 0.4,
  rowStagger: 0.04,
  device: 0.9,
  deviceStagger: 0.12,
  // controls
  scramble: 0.4, // a primary button's label resolving
  journalHold: 1.6, // "Coming soon" stays this long
  menu: 0.7,
  folderCover: 0.35,
  folderPop: 0.45,
  // hero reveal: the colour photo "compiles in" as blocks round the pointer
  revealCell: 12, // CSS px per block
  revealRadius: 90, // CSS px
  revealDecay: 0.92, // per frame
  // project overlay (unchanged from v1)
  overlayIn: 0.6,
  cutIn: 0.85,
  cutOut: 0.6,
  cutEase: "power4.inOut",
  cutFade: 0.3,
  sweep: 0.9,
  cardIn: 0.45,
  cardOut: 0.2,
} as const;

/**
 * Owner's decision (2026-10-28): motion always plays, whatever the device's reduced-motion setting says.
 * Set to true to honour the setting again; every animation below has its reduced fallback built in.
 */
export const RESPECT_REDUCED_MOTION = false;
export const reduceMotion = () => RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
