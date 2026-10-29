<template>
  <v-app>
    <!-- One ground for the whole site: the watercolour meadow, held behind
         every section. It is a fixed layer, so it stays put as you scroll
         rather than sliding the florals up past the content. -->
    <div class="site-bg" aria-hidden="true"></div>

    <v-main class="default-layout">
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
.site-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  /* A light wash over the image. The painting is pale enough to carry dark
     type almost everywhere, so this stays near-transparent through the top
     and only gathers over the foliage at the foot, where the stems are
     dark enough to break up a line of text. */
  background-image:
    linear-gradient(
      180deg,
      rgba(244, 246, 241, 0.1) 0%,
      rgba(244, 246, 241, 0.18) 58%,
      rgba(244, 246, 241, 0.46) 100%
    ),
    url("/img/bg-floral.png");
  background-size: cover, cover;
  background-position: center, center bottom;
  background-repeat: no-repeat, no-repeat;
  background-color: var(--paper);
}

/* Content sits above the background layer */
.default-layout {
  position: relative;
  z-index: 1;
  background: transparent !important;
}

/* Vuetify paints a white background on the app root – make it transparent
   so our single background shows through everywhere. */
:deep(.v-application),
:deep(.v-application__wrap),
:deep(.v-main) {
  background: transparent !important;
}

/* ── Any landscape viewport ───────────────────────────────────
   The painting is portrait and very tall. `cover` on a landscape screen
   scales it by width, which magnifies the meadow and shows only the bottom
   third of the composition. Fitting it to the viewport height instead shows
   the whole painting — misty top, meadow at the foot — and repeating across
   restores the full width as one continuous meadow.

   Keyed on aspect, not width: a phone held sideways (844x390) and an iPad in
   landscape (1024x768) have exactly the same problem as a desktop, and a
   width breakpoint misses both. Portrait screens keep `cover` from the rule
   above, where the viewport already matches the artwork.
   ──────────────────────────────────────────────────────────── */
@media (min-aspect-ratio: 1/1) {
  .site-bg {
    background-size: cover, auto 100%;
    background-position: center, center bottom;
    background-repeat: no-repeat, repeat-x;
  }
}
</style>
