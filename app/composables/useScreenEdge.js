// Keeps the phone's status bar and the browser's toolbars in the colour of
// whatever is filling the screen.
//
// Safari on iOS 26 paints the status-bar strip and the area round its
// floating toolbar from the page's own background colour (it no longer reads
// <meta name="theme-color">), while Chrome on Android uses theme-color. So
// both are set: the html/body background for Safari, the meta for Chrome.
//
// Full-screen layers (the envelope, the welcome cover) each claim a colour
// while they are up and release it when they go; the most recent claim wins,
// and with none left the page's own ground comes back.

const PAGE = "#eef0e9"; // --paper in main.scss
const claims = [];

function apply() {
  if (typeof document === "undefined") return;
  const color = claims.length ? claims[claims.length - 1].color : PAGE;

  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

/** Claim the screen edges for `color`. Returns a function that releases it. */
export function claimScreenEdge(color) {
  const claim = { color };
  claims.push(claim);
  apply();
  return () => {
    const i = claims.indexOf(claim);
    if (i !== -1) claims.splice(i, 1);
    apply();
  };
}
