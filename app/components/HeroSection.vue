<script setup>
const { t } = useLang();
</script>

<template>
  <section id="home" class="hero">
    <p class="hero-celebration rise" style="--delay: 0.1s">
      {{ t("hero.celebration") }}
    </p>

    <PopilMedallion class="hero-medallion">
      <p class="hero-welcome rise" style="--delay: 1.5s">
        {{ t("hero.warmWelcome") }}
      </p>
      <h1 class="hero-names rise" style="--delay: 1.7s">
        {{ t("hero.plaqueNames") }}
      </h1>
    </PopilMedallion>

    <div class="hero-when">
      <p class="hero-date rise" style="--delay: 2.2s">{{ t("hero.date") }}</p>
      <p class="hero-lunar rise" style="--delay: 2.35s">{{ t("hero.dateLunar") }}</p>
      <p class="hero-venue rise" style="--delay: 2.5s">{{ t("hero.venue") }}</p>
    </div>

    <div class="scroll-cue rise" style="--delay: 2.9s">
      <span class="cue-label">{{ t("hero.scrollDown") }}</span>
      <v-icon class="cue-icon">mdi-chevron-down</v-icon>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100svh;
  background: transparent;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  gap: 18px;

  padding: 72px 20px 28px;
}

/* Shared foil, used on the three pieces of type that carry the page. */
.hero-celebration,
.hero-names,
.hero-date {
  background: var(--k-foil);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.65));
}

.hero-celebration {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-size: clamp(17px, 4.4vw, 26px);
  letter-spacing: 0.06em;
  line-height: 2.1;
  margin: 0;
  max-width: 22ch;
}

.hero-medallion {
  flex: 0 0 auto;
}

.hero-welcome {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(13px, 3.1vw, 16px);
  letter-spacing: 0.16em;
  color: rgba(212, 168, 67, 0.85);
  margin: 0 0 6px;
  line-height: 1.9;
}

.hero-names {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 500;
  font-size: clamp(19px, 5vw, 30px);
  line-height: 2;
  margin: 0;
}

.hero-when {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 34ch;
}

.hero-date {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-weight: 500;
  font-size: clamp(16px, 4vw, 22px);
  letter-spacing: 0.05em;
  line-height: 1.9;
  margin: 0;
}

/* The lunar reckoning, set quieter than the civil date beside it. */
.hero-lunar {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(12px, 3.2vw, 15px);
  color: rgba(212, 168, 67, 0.72);
  line-height: 1.9;
  margin: 0;
}

.hero-venue {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(12px, 3.3vw, 15px);
  color: rgba(232, 220, 207, 0.72);
  line-height: 1.9;
  margin: 4px 0 0;
}

/* ---- Scroll cue ---- */
.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  color: rgba(232, 220, 207, 0.8);
}

.cue-label {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: 13px;
  letter-spacing: 0.14em;
  line-height: 1.8;
}

.cue-icon {
  font-size: 26px;
  color: var(--k-gold);
  animation: cue-bounce 2.2s ease-in-out infinite;
}

/* ---- Load sequence ----
   The page arrives in order: the blessing, then the ring drawing itself,
   then the names inside it, then when and where. One orchestrated moment
   rather than scattered effects. */
.rise {
  opacity: 0;
  animation: rise-in 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) var(--delay, 0s) forwards;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  .rise {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 64px 18px 20px;
    gap: 10px;
  }
}
</style>
