<template>
  <section id="rsvp" class="rsvp-section">
    <v-container>
      <h2 class="section-title text-center" data-aos="fade-up">{{ t("rsvp.title") }}</h2>

      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="rsvp-card" data-aos="fade-up" data-aos-delay="100">
            <v-card-title class="text-center gold">
              {{ t("rsvp.confirm") }}
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="submitRSVP">
                <v-text-field
                  v-model="name"
                  :label="t('rsvp.name')"
                  variant="outlined"
                />

                <v-text-field
                  v-model="phone"
                  :label="t('rsvp.phone')"
                  variant="outlined"
                />

                <v-select
                  v-model="attendance"
                  :items="[t('rsvp.attending'), t('rsvp.notAttending')]"
                  :label="t('rsvp.willAttend')"
                  variant="outlined"
                />

                <v-textarea
                  v-model="message"
                  :label="t('rsvp.message')"
                  variant="outlined"
                />

                <v-btn type="submit" color="#C8A96A" size="large" block>
                  {{ t("rsvp.send") }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from "vue";

const { t } = useLang();

const name = ref("");
const phone = ref("");
const attendance = ref("");
const message = ref("");

function submitRSVP() {
  console.log({
    name: name.value,
    phone: phone.value,
    attendance: attendance.value,
    message: message.value,
  });

  alert(t("rsvp.thanks"));
}
</script>

<style scoped>
.rsvp-section {
  padding: 56px 20px;

  /* No own background – shows the single site background */
  background: transparent;
}

.section-title {
  font-size: clamp(28px, 6vw, 42px);
  margin-bottom: 36px;
}

@media (max-width: 640px) {
  .rsvp-section {
    padding: 36px 16px;
  }
  .section-title {
    margin-bottom: 24px;
  }
}

.rsvp-card {
  padding: 30px;
  border-radius: 24px;

  /* Frosted glass instead of solid white */
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.45);

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.gold {
  color: #c8a96a;
}
</style>
