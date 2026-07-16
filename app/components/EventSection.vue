<script setup>
const { t } = useLang();
</script>

<template>
  <section id="event" class="event-section">
    <v-container class="text-center">
      <h2 class="section-title" data-aos="fade-up">{{ t("event.title") }}</h2>

      <v-row justify="center" class="mt-10">
        <v-col cols="12" md="4">
          <v-card class="event-card" data-aos="fade-up" data-aos-delay="0">
            <v-card-title class="gold">{{ t("event.ceremony") }}</v-card-title>

            <v-card-text>
              <p>{{ t("event.date") }}</p>

              <p>{{ t("event.timeMorning") }}</p>

              <p>{{ t("event.location") }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="event-card" data-aos="fade-up" data-aos-delay="150">
            <v-card-title class="gold">{{ t("event.reception") }}</v-card-title>

            <v-card-text>
              <p>{{ t("event.date") }}</p>

              <p>{{ t("event.timeEvening") }}</p>

              <p>{{ t("event.location") }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.event-section {
  padding: 56px 20px;

  /* No own background – shows the single site background */
  background: transparent;
}

.section-title {
  font-size: clamp(28px, 6vw, 42px);
}

@media (max-width: 640px) {
  .event-section {
    padding: 36px 16px;
  }
}

.event-card {
  padding: 30px;

  border-radius: 24px;

  /* Frosted glass instead of solid white */
  background: rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);

  transition: 0.3s;
}

.event-card:hover {
  transform: translateY(-8px);
}

.gold {
  color: #c8a96a;

  font-weight: 600;
}
</style>
