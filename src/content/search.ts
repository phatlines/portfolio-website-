// What the hero search understands besides project names, types, tags and stacks. Words are lower case.

/** Words that carry no meaning in "a website for my studio". */
export const stopwords = new Set(["a", "an", "the", "for", "my", "me", "i", "to", "of", "and", "or", "in", "on", "with", "want", "need", "build", "building", "make", "making", "create", "new", "looking", "show", "find", "please", "that"]);

/** A query word also counts as these words. One way: "mac" finds macOS projects, "macos" does not need "mac". */
export const synonyms: Record<string, string[]> = {
  mac: ["macos", "desktop"],
  macos: ["mac", "desktop"],
  osx: ["macos"],
  desktop: ["macos"],
  iphone: ["ios", "mobile"],
  ios: ["mobile"],
  android: ["mobile"],
  phone: ["mobile", "ios", "android"],
  mobile: ["ios", "android"],
  site: ["website"],
  web: ["website"],
  landing: ["website"],
  portfolio: ["website"],
  saas: ["web", "app"],
  dashboard: ["web", "app"],
  software: ["app"],
  tool: ["app"],
  film: ["motion"],
  video: ["motion"],
  animation: ["motion"],
  ad: ["motion"],
  advert: ["motion"],
  commercial: ["motion"],
};
