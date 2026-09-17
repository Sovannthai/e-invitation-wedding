<script setup>
const { t } = useLang();
</script>

<template>
  <section id="gift" class="payment-section text-center">

    <v-container class="text-center">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <h2 class="section-title" data-aos="fade-up">{{ t("payment.title") }}</h2>

          <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            {{ t("payment.text") }}
          </p>

          <v-card class="payment-card pa-6" elevation="6" data-aos="zoom-in-up" data-aos-delay="150">
            <div class="qr-wrap">
              <v-img
                src="/img/aba.jpg"
                max-width="260"
                class="mx-auto qr-image"
              />
              <v-img
                src="/img/ac.jpg"
                max-width="260"
                class="mx-auto qr-image"
              />
            </div>
  
            <div class="mt-4">
              <h3 class="account-name">{{ t("payment.account") }}</h3>
              <p class="bank-name">{{ t("payment.khqr") }}</p>
            </div>

            <p class="thank-text mt-4">
              {{ t("payment.thanks") }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.payment-section {
  /* No own background – shows the single site background */
  background: transparent;
  padding: 56px 16px;
}

.qr-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.section-title {
  margin-bottom: 10px;
}

@media (max-width: 640px) {
  .payment-section {
    padding: 36px 16px;
  }
}

.section-subtitle {
  font-size: 16px;
  color: var(--ink-soft);
  margin-bottom: 32px;
}

.payment-card {
  border-radius: 20px;

  /* Frosted glass instead of solid white */
  background: var(--surface) !important;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  border: 1px solid var(--surface-edge);
  box-shadow: 0 8px 22px rgba(80, 90, 70, 0.12);
}

.qr-image {
  border-radius: 12px;
}

.account-name {
  font-weight: bold;
  font-size: 20px;
}

.bank-name {
  color: var(--ink-soft);
}

.thank-text {
  font-style: italic;
  color: #b76e79;
}

</style>