// The empty strip above the page on phones (--runway in main.scss). Safari
// on iOS 26 only draws the page under its status bar once the page has
// scrolled down a little, so the page opens scrolled just past this strip
// and the full-screen layers reach up over it.

/** Height of the runway in px; 0 where it isn't used (desktop). */
export function runwayPx() {
  if (typeof document === "undefined") return 0;
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--runway")) || 0;
}

/** Scroll down past the runway if the page is sitting on it. */
export function toRunway() {
  const r = runwayPx();
  if (r && window.scrollY < r) window.scrollTo({ top: r, behavior: "instant" });
}
