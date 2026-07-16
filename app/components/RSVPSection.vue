<template>
  <section id="rsvp" class="rsvp-section">
    <v-container class="pa-0">
      <h2 class="section-title text-center" data-aos="fade-up">
        {{ t("rsvp.title") }}
      </h2>

      <div class="rsvp-card" data-aos="fade-up" data-aos-delay="100">
        <div class="rsvp-head">
          <div class="rsvp-head-icon">
            <v-icon>mdi-email-heart-outline</v-icon>
          </div>
          <h3 class="rsvp-head-title">{{ t("rsvp.confirm") }}</h3>
        </div>

        <v-form class="rsvp-form" @submit.prevent="submitRSVP">
          <v-text-field
            v-model="name"
            :label="t('rsvp.name')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details="auto"
            prepend-inner-icon="mdi-account-outline"
          />

          <v-text-field
            v-model="phone"
            :label="t('rsvp.phone')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details="auto"
            prepend-inner-icon="mdi-phone-outline"
          />

          <v-select
            v-model="attendance"
            :items="[t('rsvp.attending'), t('rsvp.notAttending')]"
            :label="t('rsvp.willAttend')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details="auto"
            prepend-inner-icon="mdi-calendar-check-outline"
          />

          <v-textarea
            v-model="message"
            :label="t('rsvp.message')"
            variant="outlined"
            rounded="lg"
            rows="3"
            auto-grow
            hide-details="auto"
            prepend-inner-icon="mdi-message-text-outline"
          />

          <v-btn type="submit" size="large" block rounded="lg" class="rsvp-btn">
            <v-icon start>mdi-send-variant</v-icon>
            {{ t("rsvp.send") }}
          </v-btn>
        </v-form>
      </div>
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
  background: transparent;
}

.section-title {
  font-size: clamp(28px, 6vw, 42px);
  margin-bottom: 32px;
}

/* ---- Card ---- */
.rsvp-card {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 32px 28px;
  border-radius: 24px;

  /* Frosted glass */
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

/* ---- Header ---- */
.rsvp-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 24px;
}

.rsvp-head-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  box-shadow: 0 8px 18px rgba(200, 151, 31, 0.4);
}
.rsvp-head-icon :deep(.v-icon) {
  font-size: 28px;
  color: #fff;
}

.rsvp-head-title {
  /* Wraps instead of truncating (fixes the mobile cut-off) */
  font-size: clamp(18px, 4.5vw, 22px);
  line-height: 1.5;
  color: #7a5c22;
  font-weight: 600;
  white-space: normal;
  word-break: break-word;
}

/* ---- Form ---- */
.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Soft white fill on the fields so they read on the glass card */
.rsvp-form :deep(.v-field) {
  background: rgba(255, 255, 255, 0.7);
}

.rsvp-btn {
  margin-top: 6px;
  color: #fff !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(180deg, #e6c25c, #c8971f) !important;
  box-shadow: 0 10px 24px rgba(200, 151, 31, 0.4);
}

/* ---- Mobile ---- */
@media (max-width: 640px) {
  .rsvp-section {
    padding: 40px 16px;
  }
  .section-title {
    margin-bottom: 24px;
  }
  .rsvp-card {
    padding: 24px 18px;
    border-radius: 20px;
  }
  .rsvp-form {
    gap: 14px;
  }
}
</style>
