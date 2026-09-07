<script setup>
/**
 * The only divider the invitation uses: a gold hairline that fades at
 * both ends, broken in the middle by a sla tor — the tiered banana-stalk
 * offering cone carried in the procession. Ornament is spent here and on
 * the hero medallion; nowhere else on the page.
 */
</script>

<template>
  <div class="kbach-rule" role="presentation" aria-hidden="true">
    <span class="rule-line"></span>

    <svg class="rule-glyph" viewBox="0 0 26 30" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="1.1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- bud finial -->
        <path d="M13 2c2.4 3 2.4 5.4 0 7.6-2.4-2.2-2.4-4.6 0-7.6Z" />
        <!-- three tapering tiers -->
        <path d="M9.4 12h7.2l1.6 3.6H7.8Z" />
        <path d="M7.2 17.4h11.6l1.7 3.7H5.5Z" />
        <path d="M5 22.8h16l1.8 3.9H3.2Z" />
      </g>
    </svg>

    <span class="rule-line"></span>
  </div>
</template>

<style scoped>
.kbach-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  width: min(100%, var(--k-measure));
  margin: 0 auto;
  padding: 4px 20px;

  color: var(--k-gold);
}

.rule-line {
  flex: 1 1 auto;
  height: 1px;
  background: var(--k-rule);
}

.rule-glyph {
  flex: 0 0 auto;
  width: 20px;
  height: 24px;
  opacity: 0.85;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
}

@media (max-width: 640px) {
  .kbach-rule {
    gap: 10px;
    padding: 2px 16px;
  }
  .rule-glyph {
    width: 17px;
    height: 20px;
  }
}
</style>
