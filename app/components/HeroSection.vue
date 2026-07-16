<script setup>
const { t } = useLang();
</script>

<template>
  <section id="home" class="hero">
    <!-- Top: intro line -->
    <div class="hero-top" data-aos="fade-down">
      <p class="script-md gold-text">{{ t("hero.celebration") }}</p>
      <h1 class="khmer-names gold-text">{{ t("hero.names") }}</h1>
    </div>

    <!-- Middle: welcome + name plaque -->
    <div class="hero-mid">
      <p class="script-lg gold-text welcome" data-aos="fade-up" data-aos-delay="100">
        {{ t("hero.warmWelcome") }}
      </p>

      <div class="name-plaque" data-aos="zoom-in" data-aos-delay="200">
        <span class="plaque-text">{{ t("hero.plaqueNames") }}</span>
      </div>

      <p class="hero-date gold-text" data-aos="fade-up" data-aos-delay="300">
        {{ t("hero.date") }}
      </p>
    </div>

    <!-- Bottom: scroll cue -->
    <div class="scroll-cue" data-aos="fade" data-aos-delay="500">
      <v-icon class="cue-icon">mdi-gesture-swipe-down</v-icon>
      <span class="cue-km">{{ t("hero.scrollDown") }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100svh;

  /* Keep the existing site-wide background – no own background here */
  background: transparent;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;

  padding: 58px 20px 32px;
}

/* ---- Gold text shared style ---- */
.gold-text {
  background: linear-gradient(
    180deg,
    #fdf3c4 0%,
    #f4d97e 30%,
    #d9ad46 55%,
    #b8862b 75%,
    #f7e6a0 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55));
}

.script-md {
  font-family: "Great Vibes", "Moul", cursive;
  font-size: clamp(26px, 6vw, 44px);
  line-height: 2;
  margin-bottom: 6px;
}

.script-lg {
  font-family: "Great Vibes", "Moul", cursive;
  font-size: clamp(24px, 5.5vw, 40px);
}

.khmer-names {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 600;
  font-size: clamp(22px, 5.5vw, 40px);
  line-height: 2;
  margin: 0;
}

/* ---- Middle block ---- */
.hero-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.welcome {
  margin-bottom: 2px;
  line-height: 1.8;
}

/* Gold-framed name plaque (cartouche) */
.name-plaque {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 16px 40px;
  border-radius: 999px;

  background: linear-gradient(160deg, #16273c 0%, #22405c 100%);

  /* Layered gold rings around the pill */
  box-shadow:
    0 0 0 2px #0d1a2b,
    0 0 0 5px #d8ae46,
    0 0 0 7px #8a6a20,
    0 14px 34px rgba(0, 0, 0, 0.5);
}

.plaque-text {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 600;
  font-size: clamp(20px, 5vw, 34px);
  letter-spacing: 0.5px;
  white-space: nowrap;
  line-height: 1.8;
  background: linear-gradient(180deg, #fdf3c4 0%, #e9c766 50%, #c8971f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero-date {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 600;
  font-size: clamp(18px, 4.5vw, 26px);
  letter-spacing: 2px;
  margin-top: 4px;
}

/* ---- Scroll cue ---- */
.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  animation: cue-bounce 1.8s ease-in-out infinite;
}

.cue-icon {
  font-size: 34px;
  color: #f4d97e;
}

.cue-km {
  font-family: "Kantumruy Pro", sans-serif;
  font-size: 15px;
}

.cue-en {
  font-size: 12px;
  letter-spacing: 1px;
  opacity: 0.9;
}

@keyframes cue-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}
</style>
