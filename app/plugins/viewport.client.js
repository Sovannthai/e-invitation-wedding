// Publishes the height of the screen that is actually visible as --app-h.
//
// Full-screen sections are sized in dvh, which follows the browser's
// toolbars as they show and hide. Older phones don't know the unit and fall
// back to 100vh — the height with the toolbars tucked away — so the foot of
// the section (the slideshow's controls) ends up behind the toolbar; some
// in-app browsers (opened from a chat app) get it wrong in the same way.
// window.innerHeight is right everywhere, so sections use
// var(--app-h, 100dvh).
export default defineNuxtPlugin(() => {
  const root = document.documentElement;
  let frame = 0;

  const measure = () => {
    frame = 0;
    root.style.setProperty("--app-h", `${window.innerHeight}px`);
  };
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  measure();
  window.addEventListener("resize", queue, { passive: true });
  window.addEventListener("orientationchange", queue, { passive: true });
  // Toolbars sliding in and out resize the visual viewport without always
  // firing a window resize.
  window.visualViewport?.addEventListener("resize", queue, { passive: true });
});
