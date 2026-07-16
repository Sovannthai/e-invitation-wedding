<template>
  <v-app>
    <!-- Single site-wide background (shared by every section) -->
    <div class="site-bg" aria-hidden="true"></div>

    <v-main class="default-layout">
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
/* ------------------------------------------------------------------
   ONE background for the whole website.
   - Fixed layer sitting behind all content (z-index: 0, content is above).
   - Desktop / laptop: landscape crop.
   - Mobile: same image re-cropped to fit a portrait screen.
     To use a dedicated portrait image, drop it in /public/img and
     change --site-bg-mobile below (e.g. url('/img/bg-mobile.png')).
   ------------------------------------------------------------------ */
.site-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  background-image:
    linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)),
    url("/img/hero.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
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

/* 📱 Mobile: re-crop the background to follow the portrait screen */
@media only screen and (max-width: 640px) {
  .site-bg {
    /* Swap this to a portrait image if you add one, e.g.
       background-image: url('/img/bg-mobile.png'); */
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)),
      url("/img/hero.png");
    background-position: center top;
  }
}
</style>
