import { projects as all } from "../content/projects";
import type { Project } from "../content/types";

/** Live projects only, in their set order. Main work first, Side explorations last. */
export function visibleProjects(list: Project[] = all): Project[] {
  const live = list.filter((p) => p.status === "live").sort((a, b) => a.order - b.order);
  return [...live.filter((p) => p.group === "main"), ...live.filter((p) => p.group === "exploration")];
}

export const reel = visibleProjects();
export const featured = reel.filter((p) => p.featured && p.group === "main");
export const rest = reel.filter((p) => !p.featured && p.group === "main");
export const explorations = reel.filter((p) => p.group === "exploration");
export const findProject = (slug: string) => reel.find((p) => p.slug === slug);
export const nextProject = (slug: string) => reel[(reel.findIndex((p) => p.slug === slug) + 1) % reel.length];
