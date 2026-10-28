import { useCallback, useEffect, useState } from "react";
import { findProject } from "../lib/projects";

const read = () => {
  const m = location.hash.match(/^#work\/([a-z0-9-]+)$/);
  return m && findProject(m[1]) ? m[1] : null; // unknown or hidden slugs are ignored
};

/** The open project lives in the URL (#work/<slug>), so every overlay has a link you can share. */
export function useHashRoute() {
  const [slug, setSlug] = useState<string | null>(read);
  useEffect(() => {
    const on = () => setSlug(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  const open = useCallback((s: string) => { location.hash = `work/${s}`; }, []);
  const close = useCallback(() => {
    // Keep the scroll position: replace the hash instead of jumping to #work.
    history.pushState(null, "", location.pathname + location.search);
    setSlug(null);
  }, []);
  return { slug, open, close };
}
