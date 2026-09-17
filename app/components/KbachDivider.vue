<script setup>
/**
 * The flourish that parts the sections of a printed Khmer invitation:
 * a hairline broken by a small centred fleuron with mirrored scrolls.
 */
</script>

<template>
  <svg
    class="kbach-divider"
    viewBox="0 0 320 26"
    role="presentation"
    aria-hidden="true"
    focusable="false"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="1.1"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- the two rules, stopping short of the centre -->
      <path d="M4 13h108" />
      <path d="M208 13h108" />

      <!-- end ticks -->
      <path d="M112 9v8" />
      <path d="M208 9v8" />

      <!-- mirrored scrolls flanking the centre -->
      <path d="M120 13c8 0 12-5 19-5s10 3 10 5-3 5-10 5-11-5-19-5Z" />
      <path d="M200 13c-8 0-12-5-19-5s-10 3-10 5 3 5 10 5 11-5 19-5Z" />

      <!-- centre bud -->
      <path d="M160 4c3.4 4.2 3.4 7.6 0 10.8-3.4-3.2-3.4-6.6 0-10.8Z" fill="currentColor" />
      <path d="M160 16.5v5" />
      <path d="M155.5 20h9" />
    </g>
  </svg>
</template>

<style scoped>
.kbach-divider {
  display: block;
  width: min(100%, 320px);
  height: auto;
  margin: 0 auto;
  opacity: 0.75;
}
</style>
