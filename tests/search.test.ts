import { describe, expect, it } from "vitest";
import { searchProjects } from "../src/lib/search";
import { visibleProjects } from "../src/lib/projects";
import { projects } from "../src/content/projects";
import type { Project } from "../src/content/types";

const slugs = (q: string) => searchProjects(q).map((p) => p.slug);

describe("hero search", () => {
  it("finds a project by its name, in any case", () => {
    expect(slugs("SPORI")[0]).toBe("spori");
    expect(slugs("invoicely")[0]).toBe("invoicely");
    expect(slugs("skin code")[0]).toBe("african-skin-code");
  });

  it("finds by type and by synonym", () => {
    expect(slugs("mac").slice(0, 2).sort()).toEqual(["kapture", "sorti"]);
    expect(slugs("macos app").slice(0, 2).sort()).toEqual(["kapture", "sorti"]);
    expect(slugs("iphone")).toContain("fitty");
    expect(slugs("web app")[0]).toBe("invoicely");
    expect(slugs("apps")).toEqual(expect.arrayContaining(["invoicely", "fitty", "kapture", "sorti"]));
  });

  it("sends motion, film and ad to the spec ad", () => {
    for (const q of ["motion", "film", "video ad", "shopify"]) expect(slugs(q)[0]).toBe("spec-ads");
  });

  it("forgives typos and partial words", () => {
    expect(slugs("webiste").slice(0, 3)).toEqual(["spori", "ayomide", "african-skin-code"]);
    expect(slugs("kaptur")[0]).toBe("kapture");
    expect(slugs("inv")[0]).toBe("invoicely");
  });

  it("reads a sentence and ignores filler words", () => {
    expect(slugs("a website for my studio").slice(0, 3)).toEqual(["spori", "ayomide", "african-skin-code"]);
    expect(slugs("a Mac app that tidies my files")[0]).toBe("sorti");
  });

  it("makes each typed example find something fitting", () => {
    expect(slugs("A website for my studio").slice(0, 3)).toEqual(["spori", "ayomide", "african-skin-code"]);
    expect(slugs("An iPhone app for my gym")[0]).toBe("fitty");
    expect(slugs("A Mac app that tidies my files")[0]).toBe("sorti");
  });

  it("finds nothing for nonsense, empty or filler-only queries", () => {
    for (const q of ["zzzzqq", "", "   ", "a for my", "!!!"]) expect(slugs(q)).toEqual([]);
  });

  it("never returns a project that isn't visible", () => {
    const hidden: Project = { ...projects[0], slug: "secret", name: "Secretname", status: "hidden", order: 99 };
    expect(searchProjects("secretname", visibleProjects([...projects, hidden]))).toEqual([]);
    expect(slugs("secretname")).toEqual([]);
  });
});
