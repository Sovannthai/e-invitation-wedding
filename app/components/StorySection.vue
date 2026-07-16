<script setup>
const { t } = useLang();
</script>

<template>
  <section id="story" class="story-section">
    <v-container>
      <h2 class="section-title text-center" data-aos="fade-up">{{ t("story.title") }}</h2>

      <!-- Desktop Timeline -->

      <div class="desktop-timeline">
        <v-timeline align="center">
          <v-timeline-item dot-color="#C8A96A" size="large">
            <v-card class="story-card" data-aos="fade-right">
              <v-card-title>{{ t("story.firstMeet") }}</v-card-title>

              <v-card-text>
                {{ t("story.firstMeetText") }}
              </v-card-text>
            </v-card>
          </v-timeline-item>

          <v-timeline-item dot-color="#C8A96A" size="large">
            <v-card class="story-card" data-aos="fade-left">
              <v-card-title>{{ t("story.fallingInLove") }}</v-card-title>

              <v-card-text>{{ t("story.fallingInLoveText") }}</v-card-text>
            </v-card>
          </v-timeline-item>

          <v-timeline-item dot-color="#C8A96A" size="large">
            <v-card class="story-card" data-aos="fade-right">
              <v-card-title>{{ t("story.proposal") }}</v-card-title>

              <v-card-text>
                {{ t("story.proposalText") }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>

      <!-- Mobile Layout -->

      <div class="mobile-story">
        <v-row>
          <v-col cols="12">
            <v-card class="story-card" data-aos="fade-up">
              <v-card-title>{{ t("story.firstMeet") }}</v-card-title>
              <v-card-text>
                {{ t("story.firstMeetText") }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="story-card" data-aos="fade-up">
              <v-card-title>{{ t("story.fallingInLove") }}</v-card-title>
              <v-card-text>{{ t("story.fallingInLoveText") }}</v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="story-card" data-aos="fade-up">
              <v-card-title>{{ t("story.proposal") }}</v-card-title>
              <v-card-text>
                {{ t("story.proposalText") }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.story-section {
  padding: 56px 20px;

  /* No own background – shows the single site background */
  background: transparent;
}

/* title */

.section-title {
  font-size: clamp(28px, 6vw, 42px);
  margin-bottom: 36px;
}

@media (max-width: 640px) {
  .story-section {
    padding: 36px 16px;
  }
  .section-title {
    margin-bottom: 24px;
  }
}

/* cards */

.story-card {
  border-radius: 20px;
  padding: 10px;

  /* Frosted glass instead of solid white */
  background: rgba(255, 255, 255, 0.38) !important;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  border: 1px solid rgba(255, 255, 255, 0.45);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* desktop */

.desktop-timeline {
  display: block;
}

/* mobile */

.mobile-story {
  display: none;
}

/* responsive */

@media (max-width: 960px) {
  .desktop-timeline {
    display: none;
  }

  .mobile-story {
    display: block;
  }
}
</style>
