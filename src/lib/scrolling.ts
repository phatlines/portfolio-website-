/**
 * Marks the page as scrolling (until 150ms after the last scroll), so a label scramble does not fire on buttons that only slide under a still pointer.
 * Read through isScrolling().
 */
let timer: ReturnType<typeof setTimeout>;
export const isScrolling = () => document.documentElement.hasAttribute("data-scrolling");
if (typeof window !== "undefined") {
  addEventListener("scroll", () => {
    document.documentElement.setAttribute("data-scrolling", "");
    clearTimeout(timer);
    timer = setTimeout(() => document.documentElement.removeAttribute("data-scrolling"), 150);
  }, { passive: true, capture: true });
}
