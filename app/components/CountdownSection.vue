<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const { t } = useLang();

const weddingDate = new Date("2026-12-20T09:00:00");

const days = ref("00");
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");

let timer = null;

function updateCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) {
    days.value = hours.value = minutes.value = seconds.value = "00";
    return;
  }

  days.value = String(Math.floor(diff / 86400000)).padStart(2, "0");
  hours.value = String(Math.floor(diff / 3600000) % 24).padStart(2, "0");
  minutes.value = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
  seconds.value = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
}

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <section id="countdown" class="countdown-section">
    <div class="countdown-inner">
      <p class="k-eyebrow" data-aos="fade-up">{{ t("countdown.eyebrow") }}</p>
      <h2 class="countdown-title" data-aos="fade-up" data-aos-delay="60">
        {{ t("countdown.title") }}
      </h2>

      <!-- Four figures on one line, parted by hairlines — an inscription,
           not four cards. The numerals carry this section on their own. -->
      <div class="clock" data-aos="fade-up" data-aos-delay="120">
        <div class="unit">
          <span class="figure">{{ days }}</span>
          <span class="unit-label">{{ t("countdown.days") }}</span>
        </div>
        <span class="unit-divider" aria-hidden="true"></span>

        <div class="unit">
          <span class="figure">{{ hours }}</span>
          <span class="unit-label">{{ t("countdown.hours") }}</span>
        </div>
        <span class="unit-divider" aria-hidden="true"></span>

        <div class="unit">
          <span class="figure">{{ minutes }}</span>
          <span class="unit-label">{{ t("countdown.minutes") }}</span>
        </div>
        <span class="unit-divider" aria-hidden="true"></span>

        <div class="unit">
          <span class="figure">{{ seconds }}</span>
          <span class="unit-label">{{ t("countdown.seconds") }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-section {
  padding: 64px 20px;
  background: transparent;
}

.countdown-inner {
  width: min(100%, var(--k-measure));
  margin: 0 auto;
  text-align: center;
}

.countdown-title {
  margin: 6px 0 36px;
}

.clock {
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.unit {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 6px;
}

.figure {
  font-family: "Cormorant Garamond", serif;
  font-weight: 300;
  font-size: clamp(38px, 12vw, 64px);
  line-height: 1.15;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "tnum" 1;

  background: var(--k-foil);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.6));
}

.unit-label {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(11px, 3vw, 13px);
  letter-spacing: 0.14em;
  color: rgba(232, 220, 207, 0.7);
  line-height: 1.9;
}

.unit-divider {
  flex: 0 0 1px;
  align-self: center;
  height: clamp(34px, 9vw, 52px);
  background: linear-gradient(
    180deg,
    rgba(212, 168, 67, 0) 0%,
    rgba(212, 168, 67, 0.45) 50%,
    rgba(212, 168, 67, 0) 100%
  );
}

@media (max-width: 640px) {
  .countdown-section {
    padding: 44px 12px;
  }
  .countdown-title {
    margin-bottom: 26px;
  }
  .unit {
    padding: 0 2px;
  }
}
</style>
