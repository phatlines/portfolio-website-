import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../src/content/projects";
import { visibleProjects } from "../src/lib/projects";
import type { Project } from "../src/content/types";
import { site } from "../src/content/site";

const pub = (src: string) => join(__dirname, "..", "public", src);
const MB = 1024 * 1024;

describe("project list", () => {
  it("has unique slugs and order numbers", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it("uses lowercase kebab-case slugs", () => {
    for (const p of projects) expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has every media file on disk, within the size limits", () => {
    for (const p of projects) {
      for (const src of [p.media.src, p.media.poster]) {
        expect(existsSync(pub(src)), `${p.slug}: ${src} is missing`).toBe(true);
        const limit = src.endsWith(".mp4") ? 2 * MB : 0.5 * MB;
        expect(statSync(pub(src)).size, `${p.slug}: ${src} is too large`).toBeLessThanOrEqual(limit);
      }
      expect(p.media.alt.length, `${p.slug}: media needs a description`).toBeGreaterThan(0);
    }
  });

  it("shows only live projects, in order, with Side explorations last", () => {
    const base = projects[0];
    const list: Project[] = [
      { ...base, slug: "c", order: 3, status: "live", group: "exploration" },
      { ...base, slug: "a", order: 1, status: "live", group: "main" },
      { ...base, slug: "d", order: 4, status: "in-progress", group: "main" },
      { ...base, slug: "b", order: 2, status: "hidden", group: "main" },
      { ...base, slug: "e", order: 5, status: "live", group: "main" },
    ];
    expect(visibleProjects(list).map((p) => p.slug)).toEqual(["a", "e", "c"]);
  });

  it("features one project per platform, each with its screen on disk", () => {
    const f = visibleProjects().filter((p) => p.featured);
    expect(f.map((p) => p.slug)).toEqual(["spori", "invoicely", "fitty", "kapture"]);
    for (const p of f) {
      expect(p.screen, `${p.slug}: a featured project needs a screen`).toBeDefined();
      for (const src of [p.screen!.src, p.screen!.poster].filter(Boolean) as string[]) expect(existsSync(pub(src)), `${p.slug}: ${src} is missing`).toBe(true);
    }
  });

  it("wires every process job to visible projects", () => {
    const visible = visibleProjects().map((p) => p.slug);
    for (const j of site.process.jobs) for (const slug of j.examples) expect(visible, `${j.name} → ${slug}`).toContain(slug);
  });

  it("gives every live link an https address", () => {
    for (const p of projects) if (p.liveUrl) expect(p.liveUrl).toMatch(/^https:\/\//);
  });
});
