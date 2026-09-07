<script setup>
/**
 * In a Khmer wedding the parents are the hosts — the invitation is issued
 * in their name, not the couple's. This section carries that, and is set
 * as plain type on the ground rather than in a panel: the families speak
 * directly, without a frame around them.
 */
const { t } = useLang();
</script>

<template>
  <section id="family" class="family-section">
    <div class="family-inner">
      <p class="k-eyebrow" data-aos="fade-up">{{ t("family.eyebrow") }}</p>
      <h2 class="section-title" data-aos="fade-up" data-aos-delay="60">
        {{ t("family.title") }}
      </h2>

      <div class="parents" data-aos="fade-up" data-aos-delay="120">
        <div class="parent-side">
          <p class="side-label">{{ t("family.groomSide") }}</p>
          <p class="parent-name">{{ t("family.groomFather") }}</p>
          <p class="parent-name">{{ t("family.groomMother") }}</p>
        </div>

        <span class="parents-divider" aria-hidden="true"></span>

        <div class="parent-side">
          <p class="side-label">{{ t("family.brideSide") }}</p>
          <p class="parent-name">{{ t("family.brideFather") }}</p>
          <p class="parent-name">{{ t("family.brideMother") }}</p>
        </div>
      </div>

      <p class="invite-text" data-aos="fade-up" data-aos-delay="180">
        {{ t("family.invite") }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.family-section {
  padding: 64px 20px;
  background: transparent;
}

.family-inner {
  width: min(100%, var(--k-measure));
  margin: 0 auto;
  text-align: center;
}

.section-title {
  margin: 6px 0 34px;
}

/* ---- The two families, side by side ---- */
.parents {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 28px;
  margin-bottom: 32px;
}

.parent-side {
  flex: 1 1 0;
  min-width: 0;
}

.side-label {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(212, 168, 67, 0.7);
  margin: 0 0 12px;
  line-height: 2;
}

.parent-name {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(15px, 3.8vw, 19px);
  color: var(--k-silk);
  line-height: 2;
  margin: 0;
}

/* A single gold hairline holding the two families apart. */
.parents-divider {
  flex: 0 0 1px;
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(212, 168, 67, 0) 0%,
    rgba(212, 168, 67, 0.5) 50%,
    rgba(212, 168, 67, 0) 100%
  );
}

.invite-text {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(14px, 3.6vw, 17px);
  line-height: 2.1;
  color: rgba(232, 220, 207, 0.82);
  margin: 0 auto;
  max-width: 46ch;
}

@media (max-width: 640px) {
  .family-section {
    padding: 44px 18px;
  }
  .section-title {
    margin-bottom: 26px;
  }
  /* Stacked, with the hairline turned to lie between them. */
  .parents {
    flex-direction: column;
    gap: 22px;
  }
  .parents-divider {
    flex: 0 0 1px;
    width: 60%;
    height: 1px;
    margin: 0 auto;
    background: var(--k-rule);
  }
}
</style>
