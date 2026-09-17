<script setup>
/* ============================================================
   The envelope — tap the wax seal to open.
   Ported from the static modern-e-invitation suite: the four
   flaps peel towards the viewer, a butterfly leaves, and the
   camera pushes through the cream liner into the invitation.
   ============================================================ */
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const emit = defineEmits(["opened"]);

/* The addressee. Left generic by default; pass a name to address the
   envelope to one guest, which is what pages/[id].vue is there for. */
const props = defineProps({
  guest: { type: String, default: "" },
});

const { t } = useLang();

const addressee = computed(() => props.guest.trim() || t("envelope.guest"));

/* Where each embossed sprig sits on the 960x900 field:
   [x, y, rotation, scale]. Two offset copies of this field —
   one dark, one light — is what makes the pattern read as
   pressed into the stock rather than printed on it. */
const sprigs = [
  [-28, -17, 26, 1.06], [108, -30, 26, 1.06], [226, -39, -42, 0.92],
  [360, -41, 12, 0.84], [489, -27, -42, 1.08], [621, -25, 12, 1.11],
  [764, -25, -28, 1.05], [893, -43, -28, 0.8], [25, 107, -28, 1.03],
  [165, 102, 26, 1.06], [294, 108, 0, 0.92], [420, 102, 40, 0.83],
  [555, 110, 0, 0.85], [699, 104, 0, 0.73], [826, 100, -28, 1.06],
  [979, 90, -28, 1.06], [-56, 226, -14, 1.09], [82, 235, 12, 1.11],
  [239, 233, -28, 0.95], [361, 244, 40, 0.83], [489, 229, 0, 0.73],
  [645, 244, -28, 0.77], [760, 220, -28, 0.91], [920, 225, 40, 0.94],
  [38, 368, -14, 1.11], [153, 365, 40, 0.87], [305, 365, -14, 0.72],
  [434, 380, -28, 0.8], [575, 379, 26, 0.98], [691, 353, -14, 0.81],
  [836, 352, -42, 0.96], [973, 364, -28, 0.75], [-43, 502, 40, 0.82],
  [102, 495, 26, 0.9], [244, 510, 26, 0.77], [373, 489, 40, 0.78],
  [498, 510, 26, 0.82], [631, 489, 40, 0.97], [766, 505, 12, 1.07],
  [894, 497, -28, 0.76], [12, 632, 0, 0.82], [170, 624, 12, 1.05],
  [311, 625, 26, 0.79], [419, 620, -14, 0.91], [554, 624, -14, 1.09],
  [698, 639, -28, 0.75], [846, 630, -14, 0.74], [966, 625, 0, 0.93],
  [-48, 750, 0, 0.78], [107, 758, 40, 1.01], [222, 766, -28, 1.09],
  [379, 759, 40, 0.84], [486, 748, 26, 0.97], [649, 750, 40, 0.84],
  [762, 750, -28, 0.9], [912, 771, -28, 1.08], [18, 905, 0, 0.86],
  [175, 908, -28, 1.07], [306, 905, -28, 1.07], [415, 899, 40, 0.87],
  [550, 899, -28, 0.75], [692, 888, 12, 1.01], [844, 903, 40, 0.95],
  [983, 894, -42, 0.94],
];

const sprigTransform = ([x, y, rot, scale]) =>
  `translate(${x},${y}) rotate(${rot}) scale(${scale})`;

const isOpen = ref(false);
const isGone = ref(false);
const removed = ref(false);

let timers = [];

const motionOK = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clearTimers() {
  timers.forEach(window.clearTimeout);
  timers = [];
}

/* The end of the sequence, however it is reached. Scroll stays locked until
   this point — unlocking on the click instead let the page scroll behind an
   envelope that was still covering it, so guests landed at an arbitrary
   position once it cleared. */
function finish() {
  clearTimers();
  removed.value = true;
  unlockScroll();

  // Hand focus to the invitation. Without this the seal button unmounts and
  // keyboard and screen-reader users are dropped at the top of the document
  // with nothing announced.
  requestAnimationFrame(() => {
    const heading = document.querySelector("#home .card-title");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  });
}

function openEnvelope() {
  if (isOpen.value) return;
  isOpen.value = true;
  emit("opened");

  if (!motionOK()) {
    finish();
    return;
  }

  // Flaps peel to ~710ms and the push settles by ~1000ms; the envelope starts
  // fading under the tail of the push so the paper never cuts.
  timers.push(window.setTimeout(() => { isGone.value = true; }, 780));
  timers.push(window.setTimeout(finish, 1200));
}

/* Tap anywhere or press Escape to cut the ceremony short — a wedding link is
   reopened often, and nobody should be held through it twice. */
function skip() {
  if (!isOpen.value || removed.value) return;
  clearTimers();
  isGone.value = true;
  timers.push(window.setTimeout(finish, 200));
}

/* One handler for the whole envelope: before it opens the entire sheet is the
   target rather than only the ~130px seal; after, the same tap skips. */
function onRootPointer() {
  isOpen.value ? skip() : openEnvelope();
}

function onKeydown(e) {
  if (e.key === "Escape" && isOpen.value) skip();
}

function lockScroll() {
  document.documentElement.style.overflow = "hidden";
}

function unlockScroll() {
  document.documentElement.style.overflow = "";
}

onMounted(() => {
  lockScroll();
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  clearTimers();
  window.removeEventListener("keydown", onKeydown);
  unlockScroll();
});
</script>

<template>
  <div v-if="!removed" class="envelope-root" @click="onRootPointer">
    <!-- The ground the envelope rests on while it is still sealed;
         it fades out under the opening so the site behind never cuts in. -->
    <div
      class="envelope-ground"
      :class="{ 'is-open': isOpen, 'is-gone': isGone }"
      aria-hidden="true"
    ></div>

    <div
      class="envelope grain grain--stock"
      :class="{ 'is-open': isOpen, 'is-gone': isGone }"
    >
      <!-- The defs the whole envelope draws from -->
      <svg class="envelope__defs" aria-hidden="true" focusable="false">
        <defs>
          <g id="sprig" fill="currentColor">
            <path d="M 14,116 C 30,74 52,44 86,14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
            <path d="M 0,0 C 8.05,-6.97 6.76,-17.93 0.00,-24.91 C -6.76,-17.93 -8.05,-6.97 0,0 Z" transform="translate(19.0,103.7) rotate(69.5)" />
            <path d="M 0,0 C 5.56,-4.83 4.67,-12.42 0.00,-17.24 C -4.67,-12.42 -5.56,-4.83 0,0 Z" transform="translate(19.0,103.7) rotate(-28.5)" />
            <path d="M 0,0 C 7.67,-6.65 6.44,-17.09 0.00,-23.73 C -6.44,-17.09 -7.67,-6.65 0,0 Z" transform="translate(24.8,91.3) rotate(-19.5)" />
            <path d="M 0,0 C 7.29,-6.32 6.12,-16.24 0.00,-22.56 C -6.12,-16.24 -7.29,-6.32 0,0 Z" transform="translate(31.1,79.5) rotate(75.8)" />
            <path d="M 0,0 C 5.03,-4.37 4.23,-11.25 0.00,-15.62 C -4.23,-11.25 -5.03,-4.37 0,0 Z" transform="translate(31.1,79.5) rotate(-22.2)" />
            <path d="M 0,0 C 6.91,-5.99 5.80,-15.40 0.00,-21.39 C -5.80,-15.40 -6.91,-5.99 0,0 Z" transform="translate(37.9,68.3) rotate(-12.9)" />
            <path d="M 0,0 C 6.53,-5.66 5.49,-14.55 0.00,-20.21 C -5.49,-14.55 -6.53,-5.66 0,0 Z" transform="translate(45.4,57.5) rotate(82.4)" />
            <path d="M 0,0 C 4.51,-3.92 3.79,-10.08 0.00,-13.99 C -3.79,-10.08 -4.51,-3.92 0,0 Z" transform="translate(45.4,57.5) rotate(-15.6)" />
            <path d="M 0,0 C 6.15,-5.33 5.17,-13.71 0.00,-19.04 C -5.17,-13.71 -6.15,-5.33 0,0 Z" transform="translate(53.5,47.2) rotate(-6.4)" />
            <path d="M 0,0 C 5.77,-5.00 4.85,-12.86 0.00,-17.86 C -4.85,-12.86 -5.77,-5.00 0,0 Z" transform="translate(62.2,37.1) rotate(88.6)" />
            <path d="M 0,0 C 3.99,-3.46 3.35,-8.90 0.00,-12.37 C -3.35,-8.90 -3.99,-3.46 0,0 Z" transform="translate(62.2,37.1) rotate(-9.4)" />
            <path d="M 0,0 C 5.39,-4.67 4.53,-12.02 0.00,-16.69 C -4.53,-12.02 -5.39,-4.67 0,0 Z" transform="translate(71.7,27.3) rotate(-0.7)" />
            <path d="M 0,0 C 5.01,-4.34 4.21,-11.17 0.00,-15.52 C -4.21,-11.17 -5.01,-4.34 0,0 Z" transform="translate(82.0,17.6) rotate(93.8)" />
            <path d="M 0,0 C 6.00,-5.60 5.04,-14.40 0.00,-20.00 C -5.04,-14.40 -6.00,-5.60 0,0 Z" transform="translate(86,14) rotate(6)" />
          </g>

          <!-- Embossed, not printed: a shadow copy and a light copy, offset.
               The 960x900 field keeps the sprigs near life size whether the
               envelope stands portrait or lies landscape. -->
          <g id="emboss-field">
            <g color="#62614C" opacity=".85" transform="translate(1.1,1.3)">
              <use v-for="(s, i) in sprigs" :key="`d${i}`" href="#sprig" :transform="sprigTransform(s)" />
            </g>
            <g color="#85836A" opacity=".85" transform="translate(-1,-1.2)">
              <use v-for="(s, i) in sprigs" :key="`l${i}`" href="#sprig" :transform="sprigTransform(s)" />
            </g>
          </g>
        </defs>
      </svg>

      <div class="envelope__stage">
        <!-- the meadow the flaps open onto — no paper grain, since this is
             the site's own background rather than a sheet of stock -->
        <div class="envelope__liner"></div>

        <!-- four triangular flaps, apexes meeting under the seal -->
        <div v-for="side in ['t', 'r', 'b', 'l']" :key="side" class="flap" :class="`flap--${side}`">
          <div class="flap__face flap__front">
            <svg class="flap__emboss" viewBox="0 0 960 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
              <use href="#emboss-field" />
            </svg>
          </div>
          <div class="flap__face flap__back"></div>
        </div>

        <img class="envelope__moth" src="/svg/butterfly.svg" alt="" width="220" height="170" />

        <!-- Still a real button, so it is reachable and announced; its click
             bubbles to the root handler, which is also what makes the rest of
             the envelope tappable. Keyboard Enter/Space fire the same path. -->
        <button class="envelope__seal" type="button" :aria-label="t('envelope.hint')">
          <img src="/svg/wax-seal.svg" alt="" width="200" height="200" />
        </button>
      </div>

      <header class="envelope__to">
        <!-- The couple's names as one piece of gold Khmer calligraphy,
             with the Latin reading set in script beneath it. The artwork is
             gold on a black ground, so it is screened rather than keyed:
             see .mono-art. -->
        <div class="monogram">
          <img
            class="mono-art"
            src="/img/monogram-names.jpg"
            alt="សុវណ្ណថៃ និង សុហេង"
            width="2922"
            height="1440"
          />

          <div class="mono-latin">
            <span class="mono-latin-line">Sovannthai</span>
            <span class="mono-tie" aria-hidden="true">&amp;</span>
            <span class="mono-latin-line">Soheng</span>
          </div>
        </div>

        <!-- <p class="envelope__title">{{ t("envelope.title") }}</p> -->
      </header>

      <footer class="envelope__guest">
        <p class="guest-invite">{{ t("envelope.invite") }}</p>
        <p class="guest-plate">{{ addressee }}</p>
      </footer>

      <p class="envelope__hint">{{ t("envelope.hint") }}</p>
    </div>
  </div>
</template>

<style scoped>
/* ---------- palette & scale, local to the envelope ---------- */
.envelope-root {
  --olive: #6f6e59;
  --olive-shade: #61604d;
  --olive-deep: #55543f;
  /* Lighter grades of the same stock. The liner opens onto these, and its
     outer stop is exactly the site background's lightest olive, so the
     camera push lands on the page instead of cutting to it. */
  --olive-light: #8d8b74;
  --olive-pale: #9c9a82;
  --paper: #f4f2ec;
  --gold-light: #e3cb9a;
  --cocoa: #a87b5c;

  --t-xs: 0.72rem;
  --t-sm: 0.82rem;
  --t-md: 1.25rem;
  --t-lg: 1.6rem;

  --card-w: 480px;
  --ease-paper: cubic-bezier(0.22, 0.61, 0.36, 1);
}

.envelope-root :deep(img),
.envelope-root :deep(svg) {
  display: block;
  max-width: 100%;
}

/* The ground behind the envelope while it is still sealed. */
.envelope-ground {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: var(--olive-deep);
  pointer-events: none;
  transition: opacity 500ms ease;
}

/* The olive ground starts lifting the moment the seal is released, so the
   invitation is already showing through while the flaps are still opening.
   It has to lighten in step with the envelope: fading only the envelope would
   reveal this ground rather than the page. */
.envelope-ground.is-open {
  opacity: 0.32;
  transition: opacity 950ms ease 120ms;
}

/* Declared after .is-open so it wins once both classes are present — the two
   have equal specificity, so source order is what decides. */
.envelope-ground.is-gone {
  opacity: 0;
  transition: opacity 430ms ease;
}

/* ---------- paper & stock textures -------------------------- */
/* Grain is a real material here, not a colour: fine fibre noise
   over the cream, coarser tooth over the olive stock. */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.42;
  /* Vuetify's reset sets background-repeat: no-repeat on ::before/::after,
     which leaves a single 180px tile in the corner — state both explicitly. */
  background-repeat: repeat;
  background-size: 180px 180px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.5'/></svg>");
  mix-blend-mode: multiply;
}

.grain--stock::after {
  opacity: 0.3;
  mix-blend-mode: overlay;
}

/* ============================================================
   The envelope — the one moment of orchestrated motion
   ============================================================ */
.envelope {
  display: grid;
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100%;
  max-width: var(--card-w);
  margin-inline: auto;
  place-items: center;
  background: var(--olive-deep);
  overflow: hidden;
  perspective: 1400px;
  perspective-origin: 50% 50%;
  transition: opacity 500ms ease;
  color: var(--paper);
  font-family: "Cormorant Garamond", "Iowan Old Style", Palatino, Georgia, serif;
  line-height: 1.7;
}

.envelope__defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* The stage carries the camera push: as the flaps open it drives forward
   into the liner, the way the film pushes through the envelope mouth. */
.envelope__stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 300ms;
}

/* What the opening flaps reveal, and what the camera pushes into: the same
   meadow the site itself stands on, laid out with the same wash, size and
   anchor as .site-bg in layouts/default.vue. Matching it means the envelope
   opens onto the page rather than onto a placeholder that then cuts to it. */
.envelope__liner {
  position: absolute;
  inset: 0;
  background-color: #eef0e9;
  background-image:
    linear-gradient(
      180deg,
      rgba(244, 246, 241, 0.1) 0%,
      rgba(244, 246, 241, 0.18) 58%,
      rgba(244, 246, 241, 0.46) 100%
    ),
    url("/img/bg-floral.png");
  background-size: cover, cover;
  background-position: center, center bottom;
  background-repeat: no-repeat, no-repeat;

  /* A soft inner shadow keeps the mouth of the envelope readable as depth
     rather than the artwork simply appearing flat inside the frame. */
  box-shadow: inset 0 0 90px rgba(120, 130, 110, 0.28);
}

/* Desktop and laptop match .site-bg's own wide-screen treatment, so the
   meadow lines up across the handoff instead of jumping scale. */
@media only screen and (min-width: 1025px) {
  .envelope__liner {
    background-size: cover, auto 100%;
    background-repeat: no-repeat, repeat-x;
  }
}

/* ---- the four flaps ---------------------------------------- */
.flap {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 650ms cubic-bezier(0.34, 0.07, 0.24, 1);
}

.flap__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
}

.flap__front {
  background: var(--olive);
}

/* The pale, lit underside you see as a flap swings past upright. */
.flap__back {
  /* Lit from above, but still the same stock as the flap's face. */
  background: linear-gradient(180deg, #a3a189 0%, #93917a 60%, #83816a 100%);
}

.flap__emboss {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

/* Each flap is the full sheet, clipped to its own triangle, so the
   embossed pattern runs continuously across all four. */
.flap--t { transform-origin: 50% 0%; }
.flap--r { transform-origin: 100% 50%; }
.flap--b { transform-origin: 50% 100%; }
.flap--l { transform-origin: 0% 50%; }

.flap--t .flap__front { clip-path: polygon(0% 0%, 100% 0%, 50% 50%); }
.flap--r .flap__front { clip-path: polygon(100% 0%, 100% 100%, 50% 50%); }
.flap--b .flap__front { clip-path: polygon(100% 100%, 0% 100%, 50% 50%); }
.flap--l .flap__front { clip-path: polygon(0% 100%, 0% 0%, 50% 50%); }

/* Backs are pre-flipped, so their clip is the mirror of the front's. */
.flap--t .flap__back { clip-path: polygon(0% 100%, 100% 100%, 50% 50%); transform: rotateX(180deg); }
.flap--b .flap__back { clip-path: polygon(100% 0%, 0% 0%, 50% 50%); transform: rotateX(180deg); }
.flap--r .flap__back { clip-path: polygon(0% 0%, 0% 100%, 50% 50%); transform: rotateY(180deg); }
.flap--l .flap__back { clip-path: polygon(100% 100%, 100% 0%, 50% 50%); transform: rotateY(180deg); }

/* Light falls differently on each panel, and the folded edges cast the
   seams that make the closed envelope read as four folded triangles. */
.flap--t .flap__front { filter: brightness(1.06) drop-shadow(0 1px 1px rgba(52, 51, 39, 0.5)); }
.flap--b .flap__front { filter: brightness(0.94) drop-shadow(0 -1px 1px rgba(52, 51, 39, 0.42)); }
.flap--l .flap__front { filter: brightness(0.99) drop-shadow(1px 0 1px rgba(52, 51, 39, 0.4)); }
.flap--r .flap__front { filter: brightness(0.92) drop-shadow(-1px 0 1px rgba(52, 51, 39, 0.4)); }

.envelope__moth {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  width: clamp(94px, 24vw, 138px);
  opacity: 0;
  transform: translate(-50%, -50%) translateZ(70px) scale(0.5);
  transition: transform 800ms cubic-bezier(0.3, 0.7, 0.3, 1) 380ms,
              opacity 300ms ease 380ms;
  pointer-events: none;
}

.envelope__seal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 4;
  width: clamp(128px, 33vw, 168px);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transform: translate(-50%, -50%) translateZ(60px);
  transition: transform 420ms var(--ease-paper), opacity 300ms ease 80ms;
  filter: drop-shadow(0 6px 10px rgba(58, 48, 20, 0.38));
  /* A few slow breaths to say 'press here', then it rests. */
  animation: seal-breathe 4.2s ease-in-out 3;
}

.envelope__seal:hover {
  transform: translate(-50%, -50%) translateZ(60px) scale(1.035);
}

.envelope__seal:focus-visible {
  outline: 2px solid var(--gold-light);
  outline-offset: 10px;
  border-radius: 50%;
}

@keyframes seal-breathe {
  0%, 100% { transform: translate(-50%, -50%) translateZ(60px) scale(1); }
  50%      { transform: translate(-50%, -50%) translateZ(60px) scale(1.018); }
}

.envelope__hint {
  position: absolute;
  z-index: 5;
  bottom: clamp(2.5rem, 9vh, 4.5rem);
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  font-family: "Playfair Display", "Kantumruy Pro", serif;
  font-size: var(--t-xs);
  color: var(--paper);
  text-align: center;
  transition: opacity 220ms ease;
}

/* Caps and wide tracking suit the English hint; Khmer is caseless and
   tracking would pull its clusters off their base characters. */
html[data-locale="en"] .envelope__hint {
  letter-spacing: 0.34em;
  text-transform: uppercase;
}

.envelope__to {
  position: absolute;
  z-index: 5;
  top: clamp(2.5rem, 9vh, 4rem);
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 1.5rem;
  text-align: center;
  color: var(--paper);
  transition: opacity 260ms ease;
}

/* ---- the monogram ------------------------------------------
   Each name in Khmer at display size, its Latin reading in script
   alongside, the two columns tied by a single ampersand. The second
   Khmer name steps right of the first, as on the printed card. */
.monogram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2px, 1.2vh, 12px);
  max-width: 100%;
  margin-bottom: clamp(0.75rem, 3vh, 1.4rem);
}

/* The calligraphy is gold on a solid black ground. `screen` leaves the
   backdrop untouched wherever the source is black and keeps the gold
   everywhere else, so the artwork sits on the stock with no halo — no
   alpha channel or keying needed.

   Sized against height as well as width: the envelope turns landscape on
   wider screens, where an artwork scaled only by width would crowd out the
   seal below it. */
.mono-art {
  display: block;
  width: min(100%, clamp(230px, 64vw, 440px));
  height: auto;
  object-fit: contain;
  mix-blend-mode: screen;
}

/* From 860px up the envelope turns landscape and is a fixed 620px tall with
   the seal centred, which leaves only ~180px above it. Scaled by width alone
   the artwork ran 217px and printed the script line over the seal, so it is
   capped by height here instead. */
@media (min-width: 860px) {
  .mono-art {
    /* Height-driven here, so the box hugs the artwork rather than
       letterboxing it inside a wider one. */
    width: auto;
    max-width: min(100%, 440px);
    max-height: clamp(92px, 16vh, 165px);
  }
}

.mono-latin {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: clamp(7px, 2vw, 13px);
}

.mono-latin-line {
  font-family: Parisienne, "Snell Roundhand", "Apple Chancery", cursive;
  font-size: clamp(17px, 5vw, 24px);
  line-height: 1.4;
  color: #f0dcae;
  white-space: nowrap;
  text-shadow: 0 2px 8px rgba(30, 29, 20, 0.5);
}

.mono-tie {
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: clamp(15px, 4vw, 20px);
  line-height: 1.1;
  color: var(--gold-light);
  opacity: 0.9;
}

/* The occasion, in the ceremonial face, under the monogram. */
.envelope__title {
  margin: 0;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(13px, 3.7vw, 18px);
  line-height: 1.7;
  color: var(--paper);
  text-shadow: 0 2px 8px rgba(30, 29, 20, 0.5);
}

/* ---- the addressee ------------------------------------------
   Sits at the foot of the envelope, the way a name is written on
   one, held in a plate with a diamond at either end. */
.envelope__guest {
  position: absolute;
  z-index: 5;
  bottom: clamp(5rem, 17vh, 8rem);
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  padding: 0 1.5rem;
  text-align: center;
  color: var(--paper);
  transition: opacity 260ms ease;
}

.guest-invite {
  margin: 0 0 0.5rem;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(11px, 3vw, 14px);
  line-height: 1.8;
  color: var(--paper);
  opacity: 0.85;
}

.guest-plate {
  position: relative;
  display: inline-block;
  margin: 0;
  padding: 0.4rem 1.6rem;

  border-top: 1px solid rgba(227, 203, 154, 0.55);
  border-bottom: 1px solid rgba(227, 203, 154, 0.55);

  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(12px, 3.3vw, 16px);
  line-height: 1.9;
  color: var(--gold-light);
}

/* A small diamond closing the plate at each end. */
.guest-plate::before,
.guest-plate::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  transform: rotate(45deg);
  background: var(--gold-light);
}

.guest-plate::before {
  left: 0;
  margin-left: -3px;
}

.guest-plate::after {
  right: 0;
  margin-right: -3px;
}

/* ---- opened ------------------------------------------------ */
/* The seal releases, the four flaps fall open, a butterfly leaves,
   and the camera pushes through into the paper. */
.envelope.is-open .envelope__seal {
  transform: translate(-50%, -50%) translateZ(90px) translateY(-34px) rotate(16deg) scale(0.82);
  opacity: 0;
  animation: none;
}

.envelope.is-open .envelope__to,
.envelope.is-open .envelope__guest,
.envelope.is-open .envelope__hint {
  opacity: 0;
}

/* All four peel towards the viewer, which also keeps them in front of the
   liner rather than sorted behind it by preserve-3d. They stop short of
   upright: the reveal comes from the widening cream star and the camera
   pushing through it, not from flaps folding flat away. */
.envelope.is-open .flap--t { transform: rotateX(60deg); }
.envelope.is-open .flap--b { transform: rotateX(-57deg); transition-delay: 40ms; }
.envelope.is-open .flap--l { transform: rotateY(-54deg); transition-delay: 20ms; }
.envelope.is-open .flap--r { transform: rotateY(58deg); transition-delay: 60ms; }

.envelope.is-open .envelope__moth {
  opacity: 1;
  transform: translate(-50%, -50%) translateZ(70px) translate(-14%, -190%) rotate(-8deg) scale(1);
}

/* 1.6x, not 3.4x. The liner carries the same meadow as the page behind it,
   so a heavy push handed over at a visibly different scale; this keeps the
   two close enough that the cross-fade reads as one continuous ground. */
.envelope.is-open .envelope__stage {
  transform: scale(1.6);
}

/* The envelope lightens on the same curve as its ground, so the reveal is a
   dissolve the guest watches happen rather than a curtain dropped at the end. */
.envelope.is-open {
  opacity: 0.32;
  transition: opacity 950ms ease 120ms;
}

/* After .is-open, so it takes over when both are set. */
.envelope.is-gone {
  opacity: 0;
  pointer-events: none;
  transition: opacity 430ms ease;
}

/* ---- responsive -------------------------------------------- */
@media (min-width: 600px) {
  .envelope-root { --t-lg: 1.75rem; --t-md: 1.35rem; }
  .envelope { box-shadow: 0 26px 70px rgba(0, 0, 0, 0.3); }
}

@media (min-width: 720px) {
  .envelope-root { --card-w: 680px; }
}

/* tablet landscape: the envelope turns to landscape,
   the way a real one sits on a table */
@media (min-width: 860px) {
  .envelope-root { --card-w: 760px; }

  .envelope {
    inset: 0;
    width: min(90vw, 940px);
    height: min(84vh, 620px);
    max-width: none;
    margin: auto;
  }

  .envelope__seal { width: clamp(140px, 17vw, 176px); }
  .envelope__to { top: clamp(1.25rem, 3.5vh, 2.25rem); }
  .envelope__guest { bottom: clamp(4.5rem, 15vh, 6.5rem); }
  .envelope__hint { bottom: clamp(2rem, 7vh, 3.25rem); }
}

@media (min-width: 1024px) {
  .envelope-root { --card-w: 940px; }
  .envelope { box-shadow: 0 34px 96px rgba(0, 0, 0, 0.34); }
}

@media (min-width: 1440px) {
  .envelope-root { --card-w: 1100px; }

  .envelope {
    width: min(72vw, 1080px);
    height: min(78vh, 700px);
  }
}

/* short viewports: a phone held sideways, or a small laptop */
@media (max-height: 560px) and (min-width: 600px) {
  .envelope { height: 94vh; }
  .envelope__seal { width: clamp(96px, 20vh, 132px); }
  .envelope__to { top: 1.25rem; }
  .envelope__guest { bottom: 3.25rem; }
  .envelope__hint { bottom: 1.25rem; }
}

@media (max-height: 460px) {
  .envelope__seal { width: clamp(84px, 22vh, 116px); }
  .mono-art { width: min(100%, 52vh); }
  .mono-latin-line { font-size: clamp(13px, 4.5vh, 17px); }
  .monogram { margin-bottom: 0.5rem; }
}

/* Touch screens should not keep a stuck hover state after a tap. */
@media (hover: none) {
  .envelope__seal:hover { transform: translate(-50%, -50%) translateZ(60px); }
}

@media (prefers-reduced-motion: reduce) {
  .envelope,
  .envelope__stage,
  .flap,
  .envelope__moth,
  .envelope__seal { transition-duration: 1ms; }

  .envelope__seal { animation: none; }
  .envelope.is-open .envelope__stage { transform: none; }
  .envelope.is-open .envelope__moth { opacity: 0; }
}
</style>
