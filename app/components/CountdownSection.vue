<script setup>
import { ref, computed, onMounted } from "vue"

const days = ref("00")
const hours = ref("00")
const minutes = ref("00")
const seconds = ref("00")

const { t, locale } = useLang()

/* In Khmer the figures are written in Khmer numerals (០–៩), matching the
   dates on the rest of the invitation; English keeps 0–9. */
const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩"
const localizeDigits = (value) =>
  locale.value === "km" ? String(value).replace(/[0-9]/g, (d) => KHMER_DIGITS[d]) : value

/* Each unit carries its own photograph. Computed so the tiles re-render as
   the refs tick. */
const units = computed(() => [
  { key: "countdown.days", value: localizeDigits(days.value), photo: "/img/countdown/bouquet.jpg" },
  { key: "countdown.hours", value: localizeDigits(hours.value), photo: "/img/countdown/hands.jpg" },
  { key: "countdown.minutes", value: localizeDigits(minutes.value), photo: "/img/countdown/meant-to-be.jpg" },
  { key: "countdown.seconds", value: localizeDigits(seconds.value), photo: "/img/countdown/groom-details.jpg" },
])

const weddingDate = new Date("2026-12-20T09:00:00")

function updateCountdown() {

  const now = new Date()
  const diff = weddingDate - now

  if (diff <= 0) return

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  days.value = String(d).padStart(2, "0")
  hours.value = String(h).padStart(2, "0")
  minutes.value = String(m).padStart(2, "0")
  seconds.value = String(s).padStart(2, "0")
}

onMounted(() => {

  updateCountdown()

  setInterval(updateCountdown, 1000)

})
</script>

<template>

<section id="countdown" class="countdown-section">

<v-container class="text-center">

<h2 class="countdown-title" data-aos="fade-up">
{{ t("countdown.title") }}
</h2>

<!-- Four tiles, one photograph each; the figure sits quietly at the foot. -->
<div class="count-grid mt-10">
  <div
    v-for="(unit, i) in units"
    :key="unit.key"
    class="count-card"
    :style="{ backgroundImage: `url(${unit.photo})` }"
    data-aos="fade-up"
    :data-aos-delay="i * 80"
  >
    <div class="count-text">
      <h2>{{ unit.value }}</h2>
      <p>{{ t(unit.key) }}</p>
    </div>
  </div>
</div>

</v-container>

</section>

</template>

<style scoped>

.countdown-section{

padding:56px 20px;

/* No own background – shows the single site background */
background: transparent;

}

@media (max-width: 640px) {
  .countdown-section {
    padding: 36px 16px;
  }
}

/* ---- Photo tiles ----
   Minimal on purpose: the photograph does the work, the figure is set small
   and white at the foot, with only as much shade beneath it as legibility
   needs. No border, no glass, no lift on hover. */
.count-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(10px, 1.6vw, 20px);
  max-width: 880px;
  margin-inline: auto;
}

/* Phones turned sideways: the 3:4 tiles are sized from the screen height
   too, so all four figures sit in view under the title at once. */
@media (orientation: landscape) and (max-height: 600px) {
  .count-grid {
    max-width: min(880px, calc((100vh - 200px) * 3 + 30px));
  }
}

.count-card {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  background-color: #e9e6df;
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 26px rgba(60, 55, 40, 0.14);
}

/* Shade only the lower third, so the photo stays clear above the figure. */
.count-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(24, 22, 18, 0.62) 0%,
    rgba(24, 22, 18, 0.2) 38%,
    rgba(24, 22, 18, 0) 60%
  );
}

.count-text {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 1;
  padding: 0 8px clamp(12px, 2vw, 20px);
  text-align: center;
  color: #fff;
}

.count-card h2 {
  margin: 0;
  /* Moul catches the Khmer numerals, as it does for the date on the hero. */
  font-family: "Lexend", "Moul", serif;
  font-weight: 500;
  font-size: clamp(28px, 7vw, 44px);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
  color: #fff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
}

.count-card p {
  margin: 6px 0 0;
  font-size: clamp(11px, 2.8vw, 14px);
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.88);
}

/* Two by two on phones, where four across would shrink the figures away. */
@media (max-width: 600px) {
  .count-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 420px;
  }
}

/* Desktop and laptop: the figures were fixed at 36px, which reads small on
   a large screen. Phone and tablet keep the size above. */
@media only screen and (min-width: 1025px) {
  .countdown-section {
    padding: 84px 32px;
  }

  .count-card h2 {
    font-size: clamp(40px, 3.4vw, 60px);
  }

  .count-card p {
    font-size: clamp(16px, 1.1vw, 21px);
  }
}
</style>