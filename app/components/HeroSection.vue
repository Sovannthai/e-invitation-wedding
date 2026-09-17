<script setup>
/**
 * The invitation card itself, laid out like the printed original: title,
 * the two portraits set on a diagonal with an ampersand between them, the
 * request, and the date.
 *
 * Portraits are set per person below; adjust `crop` to reframe one.
 */
const { t } = useLang();

/* Portraits are web copies (600x900) of the originals in /img/frame.
   Both are full-length studio shots, so a centred crop would fill the frame
   with torso. `crop` is the square of the source, in its own pixels, that
   the frame should show — head and shoulders, face in the upper third. */
const couple = [
  {
    side: "groom",
    labelKey: "hero.groomLabel",
    nameKey: "hero.groomName",
    photo: "/img/frame/groom-web.jpg",
    crop: { x: 80, y: 100, size: 420 },
  },
  {
    side: "bride",
    labelKey: "hero.brideLabel",
    nameKey: "hero.brideName",
    photo: "/img/frame/bride-web.jpg",
    crop: { x: 90, y: 120, size: 420 },
  },
];

const SOURCE = { w: 600, h: 900 };

/* Place the whole photo inside the 200-unit frame so that `crop` lands
   exactly on it: scale the crop square to 200, shift by its offset. */
function placement({ x, y, size }) {
  const k = 200 / size;
  return { x: -x * k, y: -y * k, width: SOURCE.w * k, height: SOURCE.h * k };
}

/* The scalloped square the printed card frames its portraits in: four
   sides bowed gently outward, four corners notched concavely inward.
   Each notch is a quadratic whose control point sits on the square's
   own corner, which is what makes the cut read as clean and square
   rather than as a clover. */
const FRAME = [
  "M44 10",
  "Q100 -2 156 10", // top edge
  "Q190 10 190 44", // top-right notch
  "Q202 100 190 156", // right edge
  "Q190 190 156 190", // bottom-right notch
  "Q100 202 44 190", // bottom edge
  "Q10 190 10 156", // bottom-left notch
  "Q-2 100 10 44", // left edge
  "Q10 10 44 10", // top-left notch
  "Z",
].join(" ");
</script>

<template>
  <section id="home" class="hero">
    <article class="card" data-aos="fade-up">
      <h1 class="card-title">{{ t("hero.celebration") }}</h1>

      <KbachDivider class="card-rule" />

      <!-- Portraits on a diagonal: the groom's name sits under his frame,
           the bride's above hers, with the ampersand held between. -->
      <div class="couple">
        <div
          v-for="person in couple"
          :key="person.side"
          class="person"
          :class="`person--${person.side}`"
        >
          <div class="person-name">
            <p class="person-label">{{ t(person.labelKey) }}</p>
            <p class="person-value">{{ t(person.nameKey) }}</p>
          </div>

          <svg class="portrait" viewBox="0 0 200 200" role="img" :aria-label="t(person.nameKey)">
            <defs>
              <clipPath :id="`frame-${person.side}`">
                <path :d="FRAME" />
              </clipPath>
            </defs>

            <g :clip-path="`url(#frame-${person.side})`">
              <rect width="200" height="200" class="portrait-blank" />
              <image
                v-if="person.photo"
                :href="person.photo"
                v-bind="placement(person.crop)"
                preserveAspectRatio="none"
              />
            </g>

            <path :d="FRAME" class="portrait-edge" />
          </svg>
        </div>

        <span class="amp" aria-hidden="true">&amp;</span>
      </div>

      <h2 class="card-honour">{{ t("hero.honour") }}</h2>

      <KbachDivider class="card-rule" />

      <p class="card-body">{{ t("hero.inviteBody") }}</p>

      <!-- Month above, the day held between weekday and hour, year beneath. -->
      <div class="when">
        <p class="when-month">{{ t("hero.month") }}</p>

        <div class="when-row">
          <span class="when-side">{{ t("hero.weekday") }}</span>
          <span class="when-day">{{ t("hero.day") }}</span>
          <span class="when-side">{{ t("hero.time") }}</span>
        </div>

        <p class="when-year">{{ t("hero.year") }}</p>
      </div>
    </article>

    <!-- <div class="scroll-cue">
      <span class="cue-label">{{ t("hero.scrollDown") }}</span>
      <v-icon class="cue-icon">mdi-chevron-down</v-icon>
    </div> -->
  </section>
</template>

<style scoped>
.hero {
  /* Back on a pale ground, so the type is printed into it rather than
     lifted off it: brown-black prose, deep gold headings, warmer gold on
     the names. These are the values the card was drawn for. */
  --body: #4b4238;
  --heading: #7d5a2e;
  --name: #a9762f;
  --ornament: #9aa08a;

  min-height: 100vh;
  min-height: 100svh;
  background: transparent;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 68px 16px 26px;
}

/* ---- The card: the cream sheet inside the envelope ---- */
.card {
  position: relative;
  width: min(100%, 620px);
  padding: 34px 26px 38px;
  text-align: center;

  /* No sheet of its own — the invitation reads straight off the painting. */
  background: transparent;
}

/* Size, family and colour come from the shared .card-title rule in
   main.scss, which every section title also uses. */
.card-title {
  margin: 0;
}

.card-rule {
  color: var(--ornament);
  margin: 14px auto 18px;
}

/* ---- The couple ---- */
.couple {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: clamp(10px, 4vw, 26px);
  align-items: start;
  margin: 6px 0 22px;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

/* Names run wider than the frame they belong to, as on the printed card.
   The diagonal leaves the opposite column empty at each name's height, so
   the overflow has room; max-content keeps each on a single line. */
.person-name {
  width: max-content;
  max-width: 148%;
  font-weight: bold;
}

/* The groom's frame leads, his name follows; the bride's name leads. */
.person--groom {
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.person--bride {
  margin-top: clamp(22px, 8vw, 46px);
}

/* Both lines of the name block are set in the script, the way the printed
   card sets them — the label smaller and in ink, the name larger and gilt.
   Latin takes Parisienne; Khmer falls through to Kantumruy Pro behind it. */
.person-label {
  margin: 0;
  font-family: "Parisienne", "Kantumruy Pro", cursive;
  font-size: clamp(14px, 3.6vw, 17px);
  line-height: 1.8;
  color: var(--body);
}

.person-value {
  margin: 0;
  font-family: "Parisienne", "Moul", cursive;
  /* The script runs small for its point size, and its swashes need the
     extra leading, so this is set larger and looser than the sans was. */
  font-size: clamp(18px, 5.1vw, 28px);
  line-height: 1.65;
  color: var(--name);
}

.portrait {
  display: block;
  width: 100%;
  height: auto;
}

.portrait-blank {
  fill: rgba(125, 90, 46, 0.07);
}

.portrait-edge {
  fill: none;
  stroke: var(--ornament);
  stroke-width: 2;
}

/* Held at the centre of the diagonal the two frames make. */
.amp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Playfair Display", serif;
  font-style: italic;
  font-size: clamp(26px, 7vw, 40px);
  line-height: 1;
  color: var(--ornament);
}

/* ---- The request ---- */
.card-honour {
  margin: 0;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(16px, 4.3vw, 23px);
  line-height: 1.85;
  color: var(--heading);
}

.card-body {
  margin: 0 auto;
  max-width: 46ch;
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(13px, 3.5vw, 16px);
  line-height: 2.05;
  color: var(--body);
}

/* ---- The date ---- */
.when {
  margin-top: 26px;
}

.when-month {
  margin: 0;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(15px, 4vw, 20px);
  line-height: 1.8;
  color: var(--heading);
}

.when-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 3vw, 16px);
  margin: 2px 0;
}

/* Weekday and hour sit on their own rules, either side of the day. */
.when-side {
  flex: 0 1 auto;
  padding: 3px 0;
  border-top: 1px solid var(--ornament);
  border-bottom: 1px solid var(--ornament);
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(11px, 3vw, 14px);
  line-height: 1.8;
  color: var(--body);
  white-space: nowrap;
}

.when-day {
  flex: 0 0 auto;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(30px, 9vw, 46px);
  line-height: 1.3;
  color: var(--name);
}

.when-year {
  margin: 0;
  font-family: "Playfair Display", "Moul", serif;
  font-size: clamp(16px, 4.4vw, 22px);
  line-height: 1.7;
  color: var(--heading);
}

/* ---- Scroll cue ---- */
.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  color: var(--ink-soft);
}

.cue-label {
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: 13px;
  letter-spacing: 0.12em;
}

.cue-icon {
  font-size: 26px;
  color: var(--gold);
  animation: cue-bounce 2.2s ease-in-out infinite;
}

@keyframes cue-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(7px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cue-icon {
    animation: none;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 60px 12px 20px;
  }
  .card {
    padding: 26px 16px 30px;
  }
}

/* ── Desktop and laptop (≥1025px) ─────────────────────────────
   Phone and tablet keep the clamps above untouched. From here up the card
   widens with the viewport and the type grows with it, so the invitation
   fills a large screen instead of sitting phone-sized in the middle of it.
   ──────────────────────────────────────────────────────────── */
@media only screen and (min-width: 1025px) {
  .hero {
    padding: 44px 32px 22px;
    gap: 12px;
  }

  .card {
    width: min(100%, clamp(620px, 58vw, 880px));
    padding: 30px 44px 34px;
  }

  .card-rule {
    width: min(100%, clamp(320px, 30vw, 520px));
    margin: 12px auto 16px;
  }

  .couple {
    column-gap: clamp(26px, 2.6vw, 48px);
    margin: 4px 0 18px;
  }

  /* The diagonal step exists to fit two frames into a narrow column. With
     room to spread sideways it can be shallower, which is most of the
     height this block was costing. */
  .person--bride {
    margin-top: clamp(16px, 1.8vw, 30px);
  }

  /* The frames would otherwise grow with the widened card and push the
     date below the fold. Cap them and centre each in its column. */
  .portrait {
    max-width: clamp(160px, 13.5vw, 215px);
    margin-inline: auto;
  }

  .person-label {
    font-size: clamp(17px, 1.25vw, 24px);
  }

  .person-value {
    font-size: clamp(28px, 2.15vw, 42px);
  }

  .amp {
    font-size: clamp(40px, 3vw, 58px);
  }

  .card-honour {
    font-size: clamp(23px, 1.8vw, 34px);
  }

  .card-body {
    font-size: clamp(16px, 1.15vw, 22px);
    max-width: 62ch;
  }

  .when {
    margin-top: 22px;
  }

  .when-month {
    font-size: clamp(20px, 1.55vw, 30px);
  }

  .when-day {
    font-size: clamp(46px, 3.6vw, 70px);
  }

  .when-side {
    font-size: clamp(14px, 1vw, 19px);
  }

  .when-year {
    font-size: clamp(22px, 1.7vw, 33px);
  }

  .cue-label {
    font-size: 15px;
  }

  .cue-icon {
    font-size: 30px;
  }
}



/* ── Any short landscape viewport (≤1100px tall) ──────────────
   1024x768 iPad landscape, 1280x800, 1440x900 and 1920x1080 are all wide
   but shallow: scaling on width alone runs the card past the fold. Keyed on
   orientation rather than width so the iPad is caught too — at 1024px it
   sat just under a 1025px breakpoint and got nothing, leaving the hero
   1068px tall in a 768px viewport.
   ──────────────────────────────────────────────────────────── */
@media only screen and (orientation: landscape) and (max-height: 1100px) {
  .hero {
    padding: 28px 32px 14px;
    gap: 8px;
  }

  .card {
    padding: 20px 40px 24px;
  }

  .card-rule {
    margin: 8px auto 10px;
  }

  .couple {
    margin: 2px 0 12px;
  }

  .portrait {
    max-width: clamp(140px, 11.5vw, 185px);
  }

  .person--bride {
    margin-top: clamp(12px, 1.3vw, 22px);
  }

  .card-honour {
    font-size: clamp(20px, 1.55vw, 28px);
  }

  .when {
    margin-top: 14px;
  }

  .when-day {
    font-size: clamp(38px, 2.9vw, 56px);
  }
}

/* ── Any short viewport, at any width ─────────────────────────
   A phone or tablet held sideways is only 380–800px tall, and the width
   breakpoint below never reaches it — the card ran to 1068px on an 844x390
   phone, nearly three screens for the hero alone. This compresses the block
   vertically wherever height is the binding constraint, independent of how
   wide the screen is.
   ──────────────────────────────────────────────────────────── */
@media only screen and (max-height: 640px) and (orientation: landscape) {
  .hero {
    padding: 18px 16px 10px;
    gap: 6px;
    min-height: 0;
  }

  .card {
    padding: 14px 20px 16px;
  }

  .card-rule {
    margin: 5px auto 7px;
  }

  .couple {
    margin: 2px 0 8px;
  }

  /* Tie the frames to the available height, not the width. */
  .portrait {
    max-width: min(30vh, 150px);
  }

  .person--bride {
    margin-top: 8px;
  }

  .person {
    gap: 4px;
  }

  /* Wider measure means fewer lines, which is height back. */
  .card-body {
    max-width: 78ch;
  }

  .when {
    margin-top: 8px;
  }
}

</style>
