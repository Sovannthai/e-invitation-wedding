<script setup>
const { t } = useLang();

/* Opens the Google Maps app on phones, the website on desktop.
   Paste the venue's share link (maps.app.goo.gl/…) here. */
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Phnom%20Penh";
</script>

<template>
  <section id="location" class="location-section">
    <h2 class="section-title" data-aos="fade-up">{{ t("location.title") }}</h2>

    <div class="location-card" data-aos="fade-up" data-aos-delay="100">
      <span class="location-pin" aria-hidden="true">
        <v-icon>mdi-map-marker-radius</v-icon>
      </span>

      <p class="location-hint">{{ t("location.hint") }}</p>

      <a
        class="location-btn"
        :href="MAP_URL"
        target="_blank"
        rel="noopener"
      >
        <v-icon>mdi-google-maps</v-icon>{{ t("location.open") }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.location-section {
  padding: 56px 20px;
  text-align: center;
}

.section-title {
  margin-bottom: 24px;
}

.location-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(100%, 460px);
  margin: 0 auto;
  padding: 30px 24px;
  border-radius: 24px;
  background: var(--surface);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--surface-edge);
  box-shadow: 0 8px 22px rgba(80, 90, 70, 0.12);
}

.location-pin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(157, 128, 70, 0.3);
  box-shadow: 0 6px 16px rgba(80, 90, 70, 0.12);
}
.location-pin :deep(.v-icon) {
  font-size: 30px;
  color: #d9475b;
}

.location-hint {
  margin: 0;
  max-width: 34ch;
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(13px, 3.3vw, 15px);
  line-height: 1.9;
  color: var(--ink-soft);
}

.location-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(15px, 3.6vw, 16px);
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  box-shadow: 0 10px 24px rgba(200, 151, 31, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.location-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(200, 151, 31, 0.5);
}
.location-btn :deep(.v-icon) {
  font-size: 22px;
}

@media (max-width: 640px) {
  .location-section {
    padding: 40px 16px;
  }
}
</style>
