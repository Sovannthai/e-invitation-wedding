<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

/* Web-sized copies of the photos in /img/welcome-img. `pos` keeps the two
   of you in frame when `cover` crops a photo to the screen — portraits lose
   top and bottom on wide screens, landscapes lose their sides on phones. */
const slides = [
  { src: "/img/welcome/welcome-1.jpg", pos: "50% 30%" },
  { src: "/img/welcome/welcome-2.jpg", pos: "54% 60%" },
  { src: "/img/welcome/welcome-3.jpg", pos: "50% 25%" },
  { src: "/img/welcome/welcome-4-web.jpg", pos: "55% 40%" },
  { src: "/img/welcome/welcome-5.jpg", pos: "50% 30%" },
  { src: "/img/welcome/welcome-6-web.jpg", pos: "50% 50%" },
  { src: "/img/welcome/welcome-7.jpg", pos: "70% 35%" },
  { src: "/img/welcome/welcome-8.jpg", pos: "52% 50%" },
  // A designed collage with its own lettering: shown whole rather than
  // cropped to fill, which would cut its edges off. `ground` is its paper
  // colour, carried out to the screen edges round it so a tall phone shows
  // one white page top to bottom instead of a card between dark bands.
  { src: "/img/welcome/welcome-9.jpg", pos: "50% 50%", fit: "contain", ground: "#fff" },
];

/* The page tells this cover to go once it has faded out; it is only ever
   mounted by opening the envelope, so it greets a guest once per visit. */
const emit = defineEmits(["done"]);

const HOLD_MS = 5500;
/* How long the page must sit still, once the cover is off screen, before it
   is taken out. Removing it mid-fling would cut the momentum short. */
const SETTLE_MS = 180;

const root = ref(null);

const current = ref(0);
/* A photo only gets its src once it is showing or next up, so guests on
   mobile data don't download all eight before they've seen the first. */
const loaded = ref(new Set([0, 1]));

/* 0 = cover filling the screen, 1 = scrolled fully past it. */
const progress = ref(0);

let timer = null;
let frame = 0;
let settleTimer = null;
/* Set once the guest steps through the photos by hand. */
let steered = false;
/* A change the guest asked for fades quickly, so a swipe or tap answers at
   once; the autoplay keeps its slow, unhurried cross-fade. */
const quick = ref(false);

/* Plays through once. After the last photo has had its turn, the page
   glides on to the invitation by itself — unless the guest has taken over
   the photos, in which case it rests on the last one and leaves scrolling
   on to them, so stepping back from the first photo never throws them
   into the invitation a few seconds later. */
function advance() {
  if (current.value === slides.length - 1) {
    clearInterval(timer);
    if (!steered) scrollOn();
    return;
  }
  quick.value = false;
  show(current.value + 1);
}

function show(i) {
  current.value = i;
  const want = [i, (i + 1) % slides.length].filter((n) => !loaded.value.has(n));
  if (want.length) loaded.value = new Set([...loaded.value, ...want]);
}

/* A guest stepping through by hand: wraps round at either end, and the
   autoplay clock starts again so the photo they chose gets its full turn.
   However the photo is changed — autoplay, arrows, dots, keys or a swipe —
   it is the same cross-fade: the old photo fades out as the new fades in. */
function go(dir) {
  const n = slides.length;
  goTo((current.value + dir + n) % n);
}

function goTo(i) {
  if (i === current.value) return;
  steered = true;
  quick.value = true;
  show(i);
  clearInterval(timer);
  timer = setInterval(advance, HOLD_MS);
}

/* The cover is an ordinary section at the top of the page, so the browser's
   own scrolling carries the invitation up beneath it — nothing is skipped.
   Scroll only drives the parallax and fade here. */
function onScroll() {
  if (!frame) {
    frame = requestAnimationFrame(() => {
      frame = 0;
      // Measured from the runway (phones), where the cover sits at rest.
      const r = runwayPx();
      const h = (root.value?.offsetHeight || window.innerHeight) - r;
      progress.value = Math.min(1, Math.max(0, (window.scrollY - r) / h));
    });
  }

  // Once it is fully off screen and the scroll has come to rest, hand back
  // to the page to remove it, so scrolling up later finds the invitation.
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    const h = root.value?.offsetHeight || window.innerHeight;
    if (window.scrollY >= h - 1) emit("done");
  }, SETTLE_MS);
}

/* A slow eased glide down to the invitation — gentler than the browser's
   own smooth scroll, which covers a full screen in a blink. The settle
   check above then retires the cover. */
const GLIDE_MS = 1200;
let glideFrame = 0;

function scrollOn() {
  const home = document.getElementById("home");
  if (!home || glideFrame) return;

  const from = window.scrollY;
  const to = home.getBoundingClientRect().top + from;
  if (to <= from) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, to);
    return;
  }

  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const t = Math.min(1, (now - t0) / GLIDE_MS);
    window.scrollTo(0, from + (to - from) * ease(t));
    glideFrame = t < 1 ? requestAnimationFrame(step) : 0;
  };
  glideFrame = requestAnimationFrame(step);
}

/* ---- Scroll by section ----
   While the cover is on screen the page never stops partway: any downward
   wheel, swipe or key glides the whole way to the invitation in one move.
   The browser's own scrolling is held off until the glide lands — trackpad
   momentum keeps sending wheel events for a second or more, and letting
   them through would fight the glide. Once the invitation is reached,
   scrolling is entirely the guest's again. */
const SWIPE_PX = 24;
const SCROLL_KEYS = ["ArrowDown", "PageDown", " ", "Spacebar", "End"];
const BLOCKED_KEYS = [...SCROLL_KEYS, "ArrowUp", "PageUp", "Home"];

let touchY = null;
let touchX = null;
/* One gesture does one thing: once it has turned the photo or sent the page
   on, the rest of that touch is ignored. */
let swiped = false;
const SIDE_SWIPE_PX = 36;

function onWelcome() {
  const h = root.value?.offsetHeight || window.innerHeight;
  return window.scrollY < h - 1;
}

function onWheel(e) {
  if (!onWelcome()) return;
  e.preventDefault();
  if (e.deltaY > 4) scrollOn();
}

function onTouchStart(e) {
  touchY = e.touches[0]?.clientY ?? null;
  touchX = e.touches[0]?.clientX ?? null;
  swiped = false;
}

/* A sideways swipe turns the photo as soon as the finger has travelled far
   enough — no waiting for it to lift — and an upward one goes on to the
   invitation. Whichever direction the finger has moved furthest decides. */
function onTouchMove(e) {
  if (!onWelcome()) return;
  e.preventDefault();
  if (swiped || touchX === null || touchY === null) return;
  const t = e.touches[0];
  if (!t) return;
  const dx = t.clientX - touchX;
  const dy = t.clientY - touchY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > SIDE_SWIPE_PX) {
      swiped = true;
      go(dx < 0 ? 1 : -1);
    }
  } else if (-dy > SWIPE_PX) {
    // Finger moving up the screen = scrolling down the page.
    swiped = true;
    scrollOn();
  }
}

function onTouchEnd() {
  touchX = null;
  touchY = null;
}

function onKeydown(e) {
  if (!onWelcome()) return;
  // Leave browser shortcuts (Alt/Cmd+Left = Back) and text fields alone.
  if (e.altKey || e.metaKey || e.ctrlKey) return;
  if (e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]")) return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    go(e.key === "ArrowRight" ? 1 : -1);
    return;
  }
  if (!BLOCKED_KEYS.includes(e.key)) return;
  // Leave Space alone on the arrow button so it still presses it.
  if (e.target instanceof HTMLButtonElement && e.key !== "ArrowDown" && e.key !== "PageDown") return;
  e.preventDefault();
  if (SCROLL_KEYS.includes(e.key)) scrollOn();
}

/* While the cover is up, the phone's status bar and the strip round the
   browser's toolbar take its dark instead of the page's pale ground, so the
   photo reads edge to edge. The page's own colour goes back when the cover
   leaves. */
let releaseEdge = null;

/* The colour the screen edges take: the cover's dark, or the paper of a
   photo shown whole (the white collage), so the bars never frame it in
   black. */
const DARK = "#1e1d14";
const edge = computed(() => slides[current.value].ground || DARK);

watch(edge, (color) => {
  if (!releaseEdge) return;
  releaseEdge();
  releaseEdge = claimScreenEdge(color);
});

onMounted(() => {
  releaseEdge = claimScreenEdge(edge.value);
  timer = setInterval(advance, HOLD_MS);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  releaseEdge?.();
  releaseEdge = null;
  clearInterval(timer);
  clearTimeout(settleTimer);
  cancelAnimationFrame(frame);
  cancelAnimationFrame(glideFrame);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchcancel", onTouchEnd);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <section
    id="welcome"
    ref="root"
    class="welcome"
    :class="{ 'is-bare': slides[current].fit === 'contain' }"
    :style="{ '--p': progress }"
  >
    <div class="welcome-slides" :class="{ 'is-quick': quick }" aria-hidden="true">
      <img
        v-for="(s, i) in slides"
        :key="s.src"
        class="welcome-slide"
        :class="{ 'is-active': i === current }"
        :src="loaded.has(i) ? s.src : undefined"
        :style="{ objectPosition: s.pos, objectFit: s.fit || 'cover', backgroundColor: s.ground }"
        :fetchpriority="i === 0 ? 'high' : 'auto'"
        alt=""
      />
    </div>
    <div class="welcome-shade" aria-hidden="true"></div>

    <div class="welcome-content">
      <p class="welcome-top">Welcome to our Special Day</p>

      <div class="welcome-center">
        <h1 class="welcome-names">
          Sovannthai
          <span class="welcome-pair"><span class="welcome-amp">&amp;</span> Soheng</span>
        </h1>
        <p class="welcome-date">
          <span class="welcome-rule" aria-hidden="true"></span>
          19-December-2026
          <span class="welcome-rule" aria-hidden="true"></span>
        </p>
      </div>

      <div class="welcome-nav">
        <button class="welcome-arrow is-prev" aria-label="Previous photo" @click="go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </button>

        <div class="welcome-dots">
          <button
            v-for="(s, i) in slides"
            :key="s.src"
            class="welcome-dot"
            :class="{ 'is-active': i === current }"
            :style="{ '--hold': HOLD_MS + 'ms' }"
            :aria-label="`Photo ${i + 1} of ${slides.length}`"
            :aria-current="i === current ? 'true' : undefined"
            @click="goTo(i)"
          ></button>
        </div>

        <button class="welcome-arrow is-next" aria-label="Next photo" @click="go(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>

    <button class="welcome-cue" aria-label="Continue to the invitation" @click="scrollOn">
      <v-icon>mdi-chevron-down</v-icon>
    </button>
  </section>
</template>

<style scoped>
/* A full-screen section at the top of the page, in the normal flow, so the
   invitation scrolls up into view directly beneath it.

   Phones: the section takes the *large* viewport (100lvh) — the screen
   with the browser's bars tucked away — so the photo runs right to the
   bottom edge even where Safari's toolbar floats over the page or slides
   away, and no strip of the invitation ever shows beneath it. The text
   and controls are laid out in the *dynamic* viewport (100dvh, what is
   actually visible right now) so nothing sits behind a toolbar. */
.welcome {
  position: relative;
  height: 100vh;
  height: 100lvh;
  overflow: hidden;
  background: #1e1d14;
  color: #fff;
}

/* Phones: Safari on iOS 26 draws page content under its status bar and
   floating toolbar, so the cover reaches up over the page's runway
   (--runway) and down under the toolbar (--bleed-b), both set in main.scss,
   and the photo runs from the very top of the screen to the very bottom.
   The text and controls are moved down past the runway and keep to the
   visible height (--app-h below). Both are 0 on desktop. */
.welcome {
  margin-top: calc(-1 * var(--runway, 0px));
  height: calc(100lvh + var(--runway, 0px) + var(--bleed-b, 0px));
}

.welcome-content,
.welcome-cue {
  margin-top: var(--runway, 0px);
}

/* ---- Slideshow: cross-fade with a slow push-in ---- */
/* Parallax: the photo travels at about half the scroll speed and dims as
   it goes, so the cover recedes rather than simply sliding away. */
.welcome-slides {
  position: absolute;
  inset: 0;
  transform: translate3d(0, calc(var(--p, 0) * 45%), 0);
  opacity: calc(1 - var(--p, 0) * 0.45);
  will-change: transform;
}

.welcome-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.12);
  transition: opacity 1.6s ease, transform 7.5s linear;
}

.welcome-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

/* A photo the guest chose themselves fades in sooner than the autoplay's
   slow cross-fade, but still gently. */
.welcome-slides.is-quick .welcome-slide {
  transition: opacity 0.9s ease, transform 7.5s linear;
}

/* Dark at the top and bottom for the text, clear through the middle so
   the photo still carries the page. */
.welcome-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(20, 18, 12, 0.6) 0%,
      rgba(20, 18, 12, 0.12) 30%,
      rgba(20, 18, 12, 0.18) 55%,
      rgba(20, 18, 12, 0.72) 100%
    );
  transition: opacity 0.9s ease;
}

/* A designed slide (the collage) carries its own lettering, so the
   overlay text steps aside and the shading lifts while it shows. */
.welcome.is-bare .welcome-shade {
  opacity: 0;
}

.welcome.is-bare .welcome-top,
.welcome.is-bare .welcome-center {
  opacity: 0;
}

/* The collage is on white paper, so the dots and the arrow go dark to stay
   readable over it. */
.welcome.is-bare .welcome-content,
.welcome.is-bare .welcome-cue {
  text-shadow: none;
  color: #3b3a2c;
}

.welcome.is-bare .welcome-dot {
  background: rgba(59, 58, 44, 0.3);
}

.welcome.is-bare .welcome-dot.is-active::after {
  background: #b08d3e;
}

.welcome.is-bare .welcome-arrow {
  color: #3b3a2c;
  background: rgba(59, 58, 44, 0.06);
  border-color: rgba(59, 58, 44, 0.25);
}

/* ---- Text ---- */
.welcome-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  height: 100dvh;
  /* The visible height as measured by plugins/viewport.client.js, for
     browsers and in-app browsers whose dvh is missing or wrong. */
  height: var(--app-h, 100dvh);
  /* Clear of the notch / status bar above and the home indicator below,
     and of the camera cut-out at the sides when a phone is turned. */
  padding:
    calc(clamp(64px, 11vh, 96px) + env(safe-area-inset-top))
    max(20px, env(safe-area-inset-right))
    calc(clamp(64px, 12vh, 104px) + env(safe-area-inset-bottom))
    max(20px, env(safe-area-inset-left));
  text-align: center;
  font-family: "Lobster", cursive;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
  /* The words lag the scroll a little and fade out first, well before the
     photo has gone. */
  transform: translate3d(0, calc(var(--p, 0) * 30%), 0);
  opacity: calc(1 - var(--p, 0) * 1.6);
}

.welcome-top {
  margin: 0;
  font-size: clamp(18px, min(5.4vw, 6vh), 34px);
  letter-spacing: 0.02em;
  color: #fff6e2;
  animation: rise 1.2s 0.3s ease backwards;
  transition: opacity 0.9s ease;
}

.welcome-center {
  margin-top: auto;
  animation: rise 1.4s 0.6s ease backwards;
  transition: opacity 0.9s ease;
}

.welcome-names {
  margin: 0;
  font-family: "Lobster", cursive;
  font-weight: 400;
  font-size: clamp(34px, min(11vw, 13vh), 92px);
  line-height: 1.15;
  color: #fff;
}

/* On phones the names break as "Sovannthai / & Soheng", never with the
   ampersand left dangling at the end of the first line. */
.welcome-pair {
  white-space: nowrap;
}

.welcome-amp {
  display: inline-block;
  margin: 0 0.12em 0 0;
  color: #f0d595;
}

.welcome-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: clamp(10px, 2vh, 18px) 0 0;
  font-size: clamp(16px, min(4.6vw, 5vh), 28px);
  letter-spacing: 0.04em;
  color: #f6e3b4;
}

.welcome-rule {
  width: clamp(28px, 9vw, 70px);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(246, 227, 180, 0.9), transparent);
}

/* ---- Prev / next and progress dots ---- */
.welcome-nav {
  display: flex;
  align-items: center;
  gap: clamp(12px, 3vw, 20px);
  margin-top: clamp(22px, 4vh, 36px);
}

/* Frosted-glass rounds: the photo shows through blurred, so they sit on
   any picture without a hard dark disc. */
.welcome-arrow {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
  color: #fff;
  cursor: pointer;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.35s ease,
    border-color 0.35s ease,
    color 0.9s ease;
}

.welcome-arrow :deep(.v-icon) {
  font-size: 26px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* A gold ring that sweeps out on hover. */
.welcome-arrow::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(240, 213, 149, 0.45) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

@media (hover: hover) {
  .welcome-arrow:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(240, 213, 149, 0.8);
  }
  .welcome-arrow:hover::before {
    opacity: 1;
    transform: scale(1);
  }
  .welcome-arrow.is-prev:hover :deep(.v-icon) { transform: translateX(-3px); }
  .welcome-arrow.is-next:hover :deep(.v-icon) { transform: translateX(3px); }
}

.welcome-arrow:active {
  transform: scale(0.9);
}

.welcome-arrow:focus-visible,
.welcome-dot:focus-visible {
  outline: 2px solid #f0d595;
  outline-offset: 3px;
}

/* Arrows on large screens only (Vuetify's lg and up, 1280px+). Phones,
   tablets and small laptops step through the photos by swipe or the dots. */
@media (max-width: 1279.98px) {
  .welcome-arrow {
    display: none;
  }
}

.welcome-dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

/* The active dot stretches into a bar that fills with gold over the time
   the photo is held, so it doubles as the autoplay countdown. */
.welcome-dot {
  position: relative;
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  overflow: hidden;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.9s ease;
}

/* A bigger invisible target for fingers than the 6px dot itself. */
.welcome-dot::before {
  content: "";
  position: absolute;
  inset: -10px -3px;
}

.welcome-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #f0d595;
  transform: scaleX(0);
  transform-origin: left;
}

.welcome-dot.is-active {
  width: 28px;
}

.welcome-dot.is-active::after {
  animation: dot-fill var(--hold, 5.5s) linear forwards;
}

@keyframes dot-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ---- Scroll cue ---- */
/* Pinned to the foot of the *visible* screen (see .welcome), above the home
   indicator, rather than to the foot of the taller section. */
.welcome-cue {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: calc(100vh - 54px - clamp(10px, 2.5vh, 24px));
  top: calc(100dvh - 54px - clamp(10px, 2.5vh, 24px) - env(safe-area-inset-bottom));
  top: calc(var(--app-h, 100dvh) - 54px - clamp(10px, 2.5vh, 24px) - env(safe-area-inset-bottom));
  display: inline-flex;
  padding: 6px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transform: translateX(-50%);
  transition: color 0.9s ease;
  animation: bob 2.2s ease-in-out infinite;
}

.welcome-cue :deep(.v-icon) {
  font-size: 32px;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

@keyframes bob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 8px); }
}

/* Phones turned sideways: barely 400px of height. The words move up to the
   top edge (between the music and language buttons, which sit in the
   corners), the gaps close up, and everything sizes off the height. */
@media (orientation: landscape) and (max-height: 520px) {
  .welcome-content {
    padding-top: calc(18px + env(safe-area-inset-top));
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
  .welcome-date {
    margin-top: 4px;
  }
  .welcome-nav {
    margin-top: 12px;
  }
  .welcome-arrow {
    width: 36px;
    height: 36px;
  }
  .welcome-cue :deep(.v-icon) {
    font-size: 26px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .welcome-slide,
  .welcome-slide.is-active {
    transform: none;
    transition: opacity 1.6s ease;
  }
  .welcome-top,
  .welcome-center,
  .welcome-cue {
    animation: none;
  }
  .welcome-dot.is-active::after {
    animation: none;
    transform: scaleX(1);
  }
}
</style>
