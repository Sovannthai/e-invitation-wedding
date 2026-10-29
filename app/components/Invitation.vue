<template>
  <div class="petals">

    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>

  </div>
<EnvelopeOpen :guest="guest" @opened="showWelcome = true"/>

<!-- <WeddingCover/> -->

<LanguageSwitcher/>

<!-- Shown once, straight after the envelope opens; it removes itself when
     the guest scrolls past it, so scrolling back up finds the invitation. -->
<WelcomeSection v-if="showWelcome" @done="retireWelcome"/>

<HeroSection/>

<CountdownSection/>

<AgendaSection/>

<GallerySection/>

<LocationSection/>

<PaymentSection/>

<MusicPlayer/>

<NavMenu/>
</template>

<script setup>
import { ref, nextTick } from "vue";

/* The whole invitation. pages/index.vue shows it addressed to no one in
   particular; pages/[id].vue addresses the envelope to one guest. */
defineProps({
  guest: { type: String, default: "" },
});

const showWelcome = ref(false);

/* Taking the cover out shortens the page above the invitation by a full
   screen. Measure the hero before and after and scroll by the difference,
   so the guest stays exactly where they are. Measuring, rather than just
   subtracting the cover height, also covers browsers whose scroll
   anchoring already made the correction. */
async function retireWelcome() {
  const home = document.getElementById("home");
  const before = home?.getBoundingClientRect().top ?? 0;
  showWelcome.value = false;
  await nextTick();
  const after = home?.getBoundingClientRect().top ?? 0;
  if (after !== before) {
    window.scrollTo({ top: window.scrollY + (after - before), behavior: "instant" });
  }
}
</script>
