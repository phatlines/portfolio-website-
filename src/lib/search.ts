import type { Project } from "../content/types";
import { stopwords, synonyms } from "../content/search";
import { visibleProjects } from "./projects";

// "macos" ends in s, so every word, including the synonym list, is stemmed the same way and the two sides always agree.
const stem = (w: string) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w);
const split = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
const words = (s: string) => split(s).map(stem);

const syn = new Map(Object.entries(synonyms).map(([k, v]) => [stem(k), v.map(stem)]));

/** Edit distance where swapping two neighbouring letters counts as one edit ("webiste"). */
function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

/** How well one query word matches one project word: exact 3, starts with it 2, a typo away 1.5, none 0. */
function match(q: string, term: string): number {
  if (q === term) return 3;
  if (q.length >= 2 && term.startsWith(q)) return 2;
  if (q.length >= 4 && Math.abs(q.length - term.length) <= 2 && distance(q, term) <= (q.length >= 7 ? 2 : 1)) return 1.5;
  return 0;
}

/** A project's searchable words. Name, type and tags count fully; tech-stack words count half, so "motion" finds the spec ad before a site built with Framer Motion. */
const termsOf = (p: Project): [string, number][] => {
  const main = new Set(words([p.name, p.type, ...(p.tags ?? [])].join(" ")));
  return [...main].map((t): [string, number] => [t, 1]).concat(words(p.stack.join(" ")).filter((t) => !main.has(t)).map((t): [string, number] => [t, 0.5]));
};

/** Projects that fit what someone typed, best first. Only visible projects; nothing matches an empty or all-filler query. */
export function searchProjects(query: string, list: Project[] = visibleProjects()): Project[] {
  const q = split(query).filter((w) => !stopwords.has(w)).map(stem).filter((w) => w.length >= 2);
  if (!q.length) return [];
  const phrase = q.join(" ");
  return list
    .map((p, i) => {
      const terms = termsOf(p), name = words(p.name).join(" ");
      let score = 0;
      for (const w of q) {
        const options: [string, number][] = [[w, 1], ...(syn.get(w) ?? []).map((s): [string, number] => [s, 0.7])];
        score += Math.max(...options.map(([c, weight]) => weight * Math.max(...terms.map(([t, tw]) => tw * match(c, t)))));
      }
      if (score > 0 && (name === phrase || name.startsWith(phrase))) score += name === phrase ? 10 : 6; // typing a project's name finds it first
      return { p, score, i };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.p);
}
