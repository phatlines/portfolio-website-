import type Lenis from "lenis";

/** The page's smooth scroller, so the menu, the contact card and the overlay can pause it. Null on pages without one (Journal, 404). Kept apart from useSmoothScroll so those pages don't load Lenis. */
let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (l: Lenis | null) => { lenis = l; };
