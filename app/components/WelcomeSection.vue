<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

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
  // A designed collage with its own lettering: shown whole on the dark
  // ground rather than cropped to fill, which would cut its edges off.
  { src: "/img/welcome/welcome-9.jpg", pos: "50% 50%", fit: "contain" },
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

/* Plays through once. After the last photo has had its turn, the page
   glides on to the invitation by itself. */
function advance() {
  if (current.value === slides.length - 1) {
    clearInterval(timer);
    scrollOn();
    return;
  }
  current.value += 1;
  const next = current.value + 1;
  if (next < slides.length && !loaded.value.has(next)) {
    loaded.value = new Set([...loaded.value, next]);
  }
}

/* The cover is an ordinary section at the top of the page, so the browser's
   own scrolling carries the invitation up beneath it — nothing is skipped.
   Scroll only drives the parallax and fade here. */
function onScroll() {
  if (!frame) {
    frame = requestAnimationFrame(() => {
      frame = 0;
      const h = root.value?.offsetHeight || window.innerHeight;
      progress.value = Math.min(1, Math.max(0, window.scrollY / h));
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
}

function onTouchMove(e) {
  if (!onWelcome()) return;
  e.preventDefault();
  const y = e.touches[0]?.clientY;
  // Finger moving up the screen = scrolling down the page.
  if (touchY !== null && y !== undefined && touchY - y > SWIPE_PX) {
    touchY = null;
    scrollOn();
  }
}

function onKeydown(e) {
  if (!onWelcome() || !BLOCKED_KEYS.includes(e.key)) return;
  // Leave Space alone on the arrow button so it still presses it.
  if (e.target instanceof HTMLButtonElement && e.key !== "ArrowDown" && e.key !== "PageDown") return;
  e.preventDefault();
  if (SCROLL_KEYS.includes(e.key)) scrollOn();
}

onMounted(() => {
  timer = setInterval(advance, HOLD_MS);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearTimeout(settleTimer);
  cancelAnimationFrame(frame);
  cancelAnimationFrame(glideFrame);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
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
    <div class="welcome-slides" aria-hidden="true">
      <img
        v-for="(s, i) in slides"
        :key="s.src"
        class="welcome-slide"
        :class="{ 'is-active': i === current }"
        :src="loaded.has(i) ? s.src : undefined"
        :style="{ objectPosition: s.pos, objectFit: s.fit || 'cover' }"
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

      <div class="welcome-dots" aria-hidden="true">
        <span
          v-for="(s, i) in slides"
          :key="s.src"
          class="welcome-dot"
          :class="{ 'is-active': i === current }"
        ></span>
      </div>
    </div>

    <button class="welcome-cue" aria-label="Continue to the invitation" @click="scrollOn">
      <v-icon>mdi-chevron-down</v-icon>
    </button>
  </section>
</template>

<style scoped>
/* A full-screen section at the top of the page, in the normal flow, so the
   invitation scrolls up into view directly beneath it. */
.welcome {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 520px;
  overflow: hidden;
  background: #1e1d14;
  color: #fff;
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

/* ---- Text ---- */
.welcome-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: clamp(56px, 11vh, 96px) 20px clamp(72px, 12vh, 104px);
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
  font-size: clamp(20px, 5.4vw, 34px);
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
  font-size: clamp(40px, 11vw, 92px);
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
  font-size: clamp(18px, 4.6vw, 28px);
  letter-spacing: 0.04em;
  color: #f6e3b4;
}

.welcome-rule {
  width: clamp(28px, 9vw, 70px);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(246, 227, 180, 0.9), transparent);
}

/* ---- Progress dots ---- */
.welcome-dots {
  display: flex;
  gap: 7px;
  margin-top: clamp(22px, 4vh, 36px);
}

.welcome-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  transition: width 0.5s ease, background 0.5s ease;
}

.welcome-dot.is-active {
  width: 22px;
  background: #f0d595;
}

/* ---- Scroll cue ---- */
.welcome-cue {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: clamp(16px, 3vh, 28px);
  display: inline-flex;
  padding: 6px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transform: translateX(-50%);
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
}
</style>
