import { describe, expect, it } from "vitest";
import { gmail } from "../src/lib/contact";
import { mailto } from "../src/lib/mailto";
import { site } from "../src/content/site";

describe("Start a project links", () => {
  it("builds a Gmail compose link with the address and subject encoded", () => {
    const u = new URL(gmail);
    expect(u.origin + u.pathname).toBe("https://mail.google.com/mail/");
    expect(u.searchParams.get("view")).toBe("cm");
    expect(u.searchParams.get("to")).toBe(site.email);
    expect(u.searchParams.get("su")).toBe(site.contact.mailSubject);
  });

  it("keeps a mailto fallback with the same address and subject", () => {
    expect(mailto.startsWith(`mailto:${site.email}?subject=`)).toBe(true);
    expect(decodeURIComponent(mailto.split("subject=")[1])).toBe(site.contact.mailSubject);
  });
});
