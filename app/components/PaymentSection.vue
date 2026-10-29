<script setup>
import { ref } from "vue";

const { t } = useLang();

/* The two accounts, each with its own KHQR image. Bank names are plain text
   rather than logo artwork — they identify the account without reproducing
   anyone's mark. */
const accounts = [
  { id: "aba", name: "ABA Bank", qr: "/img/qr/aba-qr.jpg" },
  { id: "acleda", name: "ACLEDA Bank", qr: "/img/qr/acleda-qr.jpg" },
];

/* Whose account the codes belong to, as printed on the bank cards. */
const holder = "NEANG SOVANNTHAI";

const wishOpen = ref(false);
</script>

<template>
  <section id="gift" class="payment-section">
    <div class="gift-inner">
      <!-- A ring medallion held between two hairlines, as on the card. -->
      <div class="crest" data-aos="fade-up" aria-hidden="true">
        <span class="crest-rule"></span>
        <span class="crest-badge"><v-icon>mdi-ring</v-icon></span>
        <span class="crest-rule"></span>
      </div>

      <p class="gift-eyebrow" data-aos="fade-up" data-aos-delay="40">
        {{ t("payment.eyebrow") }}
      </p>

      <h2 class="section-title gift-names" data-aos="fade-up" data-aos-delay="80">
        {{ t("payment.namesKhmer") }}
      </h2>

      <p class="gift-latin" data-aos="fade-up" data-aos-delay="110">
        {{ t("payment.namesLatin") }}
      </p>

      <ul class="chips" data-aos="fade-up" data-aos-delay="140">
        <li class="chip chip--lead">
          <span class="chip-dot" aria-hidden="true"></span>{{ t("payment.chipKhqr") }}
        </li>
        <li class="chip">{{ t("payment.chipCurrency") }}</li>
        <li class="chip chip--wish" @click="wishOpen = true">
          <v-icon class="chip-icon">mdi-email-outline</v-icon>{{ t("payment.chipWishes") }}
        </li>
      </ul>

      <p class="gift-thanks" data-aos="fade-up" data-aos-delay="170">
        {{ t("payment.thanks") }}
      </p>

      <!-- One card per account -->
      <div class="banks">
        <article
          v-for="(acct, i) in accounts"
          :key="acct.id"
          class="bank"
          data-aos="fade-up"
          :data-aos-delay="200 + i * 90"
        >
          <div class="bank-bar" aria-hidden="true"></div>

          <h3 class="bank-name">{{ acct.name }}</h3>
          <p class="bank-scan">{{ t("payment.scanLine") }}</p>

          <!-- Corner brackets frame the code the way a scanner's viewfinder does -->
          <div class="qr">
            <img :src="acct.qr" :alt="`KHQR — ${acct.name}`" loading="lazy" />
            <span class="qr-corner qr-tl"></span>
            <span class="qr-corner qr-tr"></span>
            <span class="qr-corner qr-bl"></span>
            <span class="qr-corner qr-br"></span>
          </div>

          <p class="bank-holder">{{ holder }}</p>
        </article>
      </div>

      <button class="wish-cta" data-aos="fade-up" @click="wishOpen = true">
        <v-icon>mdi-heart-outline</v-icon>{{ t("wish.cta") }}
      </button>
    </div>

    <WishDialog v-model="wishOpen" />
  </section>
</template>

<style scoped>
.payment-section {
  background: transparent;
  padding: 64px 20px;
}

.gift-inner {
  width: min(100%, 880px);
  margin: 0 auto;
  text-align: center;
}

/* ---- Crest ---- */
.crest {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 22px;
}

.crest-rule {
  width: clamp(48px, 14vw, 120px);
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(157, 128, 70, 0) 0%,
    rgba(157, 128, 70, 0.5) 50%,
    rgba(157, 128, 70, 0) 100%
  );
}

.crest-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(157, 128, 70, 0.3);
  box-shadow: 0 6px 16px rgba(80, 90, 70, 0.12);
}

.crest-badge :deep(.v-icon) {
  font-size: 24px;
  color: var(--gold);
}

/* ---- Heading ---- */
.gift-eyebrow {
  margin: 0 0 6px;
  font-family: "Lexend", "Kantumruy Pro", serif;
  font-size: clamp(12px, 2.8vw, 15px);
  color: var(--gold);
}

.gift-names {
  margin: 0;
}

.gift-latin {
  margin: 2px 0 0;
  font-family: "Pacifico", serif;
  font-size: clamp(14px, 3.4vw, 19px);
  color: var(--ink-soft);
}

/* ---- Chips ---- */
.chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 20px 0 0;
  padding: 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--surface-edge);
  box-shadow: 0 4px 12px rgba(80, 90, 70, 0.08);

  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  font-size: clamp(12px, 2.9vw, 14px);
  line-height: 1.7;
  color: var(--ink);
}

.chip--wish {
  border-color: rgba(157, 128, 70, 0.4);
  background: rgba(252, 248, 238, 0.85);
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f8a5b;
}

.chip-icon {
  font-size: 16px !important;
  color: var(--gold);
}

.gift-thanks {
  margin: 20px auto 0;
  max-width: 46ch;
  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  font-size: clamp(13px, 3.3vw, 16px);
  line-height: 2;
  color: var(--ink-soft);
}

/* ---- Bank cards ---- */
.banks {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 2.4vw, 26px);
  margin-top: clamp(28px, 4vw, 44px);
}

.bank {
  position: relative;
  overflow: hidden;
  padding: 0 clamp(16px, 2.4vw, 26px) clamp(18px, 2.6vw, 26px);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--surface-edge);
  box-shadow: 0 12px 30px rgba(80, 90, 70, 0.14);
}

/* The dark band across the head of each card. */
.bank-bar {
  height: 10px;
  margin: 0 -40px 22px;
  background: linear-gradient(90deg, #15314f 0%, #1b3a5c 100%);
  border-radius: 0 0 10px 10px;
}

.bank-name {
  margin: 0;
  font-family: "Lexend", serif;
  font-weight: 700;
  font-size: clamp(17px, 3.6vw, 23px);
  letter-spacing: 0.04em;
  color: #16324f;
}

.bank-scan {
  margin: 4px 0 16px;
  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  font-size: clamp(12px, 2.8vw, 14px);
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}

/* ---- QR with viewfinder corners ---- */
.qr {
  position: relative;
  width: min(100%, 260px);
  margin: 0 auto;
  padding: 14px;
  border-radius: 14px;
  background: #fff;
}

.qr img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.qr-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(21, 49, 79, 0.75);
}

.qr-tl { top: 4px; left: 4px; border-right: 0; border-bottom: 0; border-radius: 5px 0 0 0; }
.qr-tr { top: 4px; right: 4px; border-left: 0; border-bottom: 0; border-radius: 0 5px 0 0; }
.qr-bl { bottom: 4px; left: 4px; border-right: 0; border-top: 0; border-radius: 0 0 0 5px; }
.qr-br { bottom: 4px; right: 4px; border-left: 0; border-top: 0; border-radius: 0 0 5px 0; }

.bank-holder {
  margin: 14px 0 0;
  font-family: "Lexend", sans-serif;
  font-size: clamp(11px, 2.7vw, 13px);
  color: var(--ink-soft);
}

/* ---- Send-a-wish button ---- */
.wish-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: clamp(26px, 4vw, 40px);
  padding: 14px 30px;
  border: none;
  border-radius: 999px;
  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  font-size: clamp(14px, 3.4vw, 16px);
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  box-shadow: 0 10px 24px rgba(200, 151, 31, 0.4);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.wish-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(200, 151, 31, 0.5);
}
.wish-cta :deep(.v-icon) {
  font-size: 20px;
}

/* ---- Phones: one card per row ---- */
@media (max-width: 600px) {
  .payment-section {
    padding: 44px 16px;
  }
  .banks {
    grid-template-columns: minmax(0, 1fr);
    max-width: 340px;
    margin-inline: auto;
  }
}

@media only screen and (min-width: 1025px) {
  .payment-section {
    padding: 84px 32px;
  }
}
</style>
