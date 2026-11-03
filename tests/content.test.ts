import { describe, expect, it } from "vitest";
import { site } from "../src/content/site";
import { composeMailto } from "../src/lib/mailto";
import { commitMessage, composeGmail } from "../src/lib/contact";

describe("availability", () => {
  it("is one source: open now, November and December open", () => {
    const open = site.availability.months.filter((m) => m.state === "open").map((m) => m.m);
    expect(open).toEqual(["Nov", "Dec"]);
    expect(site.availability.line).toContain(site.availability.status);
  });
});

describe("the New commit card", () => {
  it("writes the enquiry as a commit", () => {
    const { subject, body } = commitMessage("website", "Next month", "  a booking site for my studio ");
    expect(subject).toBe("feat(website): a booking site for my studio");
    expect(body.split("\n")).toEqual([subject, "", "+ timeline: next month", "+ from: you"]);
  });

  it("still works with nothing filled in", () => {
    expect(commitMessage(null, null, "").subject).toBe(`feat(project): ${site.contact.card.fallbackMessage}`);
  });

  it("carries the commit into the email and Gmail links", () => {
    const { subject, body } = commitMessage("mac", null, "a menu bar app");
    const m = new URL(composeMailto(subject, body));
    expect(m.searchParams.get("subject")).toBe(subject);
    expect(m.searchParams.get("body")).toBe(body);
    const g = new URL(composeGmail(subject, body));
    expect(g.searchParams.get("su")).toBe(subject);
    expect(g.searchParams.get("body")).toBe(body);
  });
});

describe("resume", () => {
  it("states experience in years and offers no PDF", () => {
    expect(site.about.stat).toMatch(/\byears?\b/);
    expect(JSON.stringify(site)).not.toMatch(/\bPDF\b|Download/i);
  });
});
