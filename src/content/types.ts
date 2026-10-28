// The single shape for project data (see ARCHITECTURE.md). Adding a project = one entry in projects.ts + its media.

export type Media = {
  kind: "video" | "image";
  src: string; // shown large (hero reel, scene, overlay)
  poster: string; // small still: film strip frame, index preview, video poster
  alt: string;
};

export type Project = {
  slug: string; // also the media file prefix in public/media/
  name: string;
  type: string; // "Website", "Web app", "iOS + Android", "Mac app", "Side exploration"
  year: number;
  role: string;
  line: string; // one line for the work list and featured scene
  story: string[]; // 2 to 3 short paragraphs for the overlay
  stack: string[];
  status: "live" | "in-progress" | "hidden"; // only "live" is shown on the site
  order: number; // lower shows first
  group: "main" | "exploration"; // "exploration" = Side explorations, always below the main list
  featured?: boolean; // gets a full-colour scene
  tags?: string[]; // extra words the hero search matches, besides name, type and stack
  tag?: string; // "In development", "Coming soon"
  liveUrl?: string;
  linkSoon?: boolean; // no live link yet, but one is coming: shows "Live link coming soon"
  color: string; // the page turns this colour while the project is on screen
  ink: string; // text colour on `color`
  media: Media;
};
