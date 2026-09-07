<template>
  <!-- app.vue already provides the <v-app> root; a second one here would
       nest two Vuetify application layers. -->
  <div class="site-shell">
    <!-- One ground for the whole invitation, in three layers:
         the couple's photograph, deeply subdued; a carved kbach lattice;
         and candlelight falling from the top. -->
    <div class="site-bg" aria-hidden="true"></div>

    <v-main class="default-layout">
      <slot />
    </v-main>
  </div>
</template>

<style scoped>
.site-shell {
  position: relative;
  min-height: 100vh;
  background: var(--k-ground);
}

.site-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--k-ground);
}

/* Layer 1 — the photograph, held well back so gold stays legible on it. */
.site-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("/img/hero.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: 0.16;
  filter: saturate(0.55) contrast(1.05);
}

/* Layer 2 — carved kbach lattice, candlelight from above, lacquer red
   pooling at the foot, and a vignette that pulls the eye to the measure. */
.site-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(120% 78% at 50% -12%, rgba(212, 168, 67, 0.18) 0%, rgba(212, 168, 67, 0) 58%),
    radial-gradient(100% 62% at 50% 112%, rgba(110, 31, 42, 0.24) 0%, rgba(110, 31, 42, 0) 62%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='132' height='132' viewBox='0 0 132 132'%3E%3Cdefs%3E%3Cg id='c' fill='none' stroke='%23D4A843' stroke-opacity='0.16' stroke-width='1.2' stroke-linecap='round'%3E%3Cpath d='M66 10c12 16 28 24 28 40 0 13-11 21-21 17-7-3-9-11-4-16 4-4 11-2 11 4'/%3E%3Cpath d='M66 10c-12 16-28 24-28 40 0 13 11 21 21 17 7-3 9-11 4-16-4-4-11-2-11 4'/%3E%3Cpath d='M66 24c0 10 4 18 4 26'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23c'/%3E%3Cuse href='%23c' transform='rotate%2890 66 66%29'/%3E%3Cuse href='%23c' transform='rotate%28180 66 66%29'/%3E%3Cuse href='%23c' transform='rotate%28270 66 66%29'/%3E%3C/svg%3E");
  background-size: auto, auto, 132px 132px;
  background-repeat: no-repeat, no-repeat, repeat;
  box-shadow: inset 0 0 220px 60px rgba(10, 18, 32, 0.85);
}

/* Content sits above the ground. */
.default-layout {
  position: relative;
  z-index: 1;
  background: transparent !important;
}

:deep(.v-application),
:deep(.v-application__wrap),
:deep(.v-main) {
  background: transparent !important;
}

/* Mobile: the photograph re-crops to the portrait screen and the lattice
   tightens so the carving does not read as oversized wallpaper. */
@media only screen and (max-width: 640px) {
  .site-bg::before {
    background-position: center top;
  }
  .site-bg::after {
    background-size: auto, auto, 96px 96px;
    box-shadow: inset 0 0 140px 40px rgba(10, 18, 32, 0.85);
  }
}
</style>
