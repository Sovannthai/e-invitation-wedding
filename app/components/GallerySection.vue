<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { t } = useLang();

const images = [
  "/img/gallery1.jpg",
  "/img/gallery2.jpg",
  "/img/envelop.jpg",
  "/img/hero.png",
  "/img/wedding.png",
];

const modules = [EffectCoverflow, Navigation, Pagination];

// Lightbox / preview
const lightbox = ref(false);
const current = ref(0);

function openPreview(index) {
  current.value = index;
  lightbox.value = true;
}
function prev() {
  current.value = (current.value - 1 + images.length) % images.length;
}
function next() {
  current.value = (current.value + 1) % images.length;
}
</script>

<template>
  <section id="gallery" class="gallery-slider">
    <h2 class="section-title text-center text-xxl mb-6" data-aos="fade-up">
      {{ t("gallery.title") }}
    </h2>

    <div class="coverflow-wrap" data-aos="fade-up" data-aos-delay="100">
      <Swiper
        :modules="modules"
        effect="coverflow"
        :grab-cursor="true"
        :centered-slides="true"
        slides-per-view="auto"
        :loop="true"
        :coverflow-effect="{
          rotate: 32,
          stretch: 0,
          depth: 140,
          modifier: 1,
          slideShadows: true,
        }"
        :navigation="true"
        :pagination="{ type: 'fraction' }"
        class="cover-swiper"
      >
        <SwiperSlide
          v-for="(img, i) in images"
          :key="img + i"
          class="cover-slide"
        >
          <img
            :src="img"
            class="cover-img"
            loading="lazy"
            @click="openPreview(i)"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Preview / lightbox -->
    <v-dialog
      v-model="lightbox"
      max-width="1000"
      transition="dialog-transition"
    >
      <div class="lightbox">
        <button class="lb-close" aria-label="Close" @click="lightbox = false">
          <v-icon>mdi-close</v-icon>
        </button>

        <button class="lb-nav lb-prev" aria-label="Previous" @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </button>

        <img :src="images[current]" class="lb-img" />

        <button class="lb-nav lb-next" aria-label="Next" @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </button>

        <div class="lb-counter">{{ current + 1 }} / {{ images.length }}</div>
      </div>
    </v-dialog>
  </section>
</template>

<style scoped>
.gallery-slider {
  padding: 56px 20px;
  background: transparent;
  /* Gold theme + smaller arrow glyph for Swiper controls */
  --swiper-navigation-color: #d8ae46;
  --swiper-pagination-color: #f0d9a8;
  --swiper-navigation-size: 12px;
}

.coverflow-wrap {
  max-width: 1000px;
  margin: 0 auto;
}

.cover-swiper {
  padding: 10px 0 48px; /* room for the fraction counter */
}

/* Each slide is a fixed-size card; coverflow angles the neighbours back */
.cover-slide {
  width: clamp(240px, 66vw, 360px);
  height: clamp(340px, 62vh, 500px);
  border-radius: 18px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  cursor: pointer;
  display: block;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

/* Swiper controls (created by JS, so reach them with :deep) */
.gallery-slider :deep(.swiper-button-next),
.gallery-slider :deep(.swiper-button-prev) {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 0 1px rgba(216, 174, 70, 0.6);
}
.gallery-slider :deep(.swiper-button-next svg),
.gallery-slider :deep(.swiper-button-prev svg) {
  width: 50%;
  height: 50%
}

.gallery-slider :deep(.swiper-pagination-fraction) {
  bottom: 8px;
  color: #f0d9a8;
  font-size: 15px;
  letter-spacing: 2px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

/* ---- Lightbox ---- */
.lightbox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.lb-close,
.lb-nav {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 1px rgba(216, 174, 70, 0.6);
  transition: 0.2s;
}
.lb-close:hover,
.lb-nav:hover {
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  color: #16273c;
}

.lb-close {
  top: 10px;
  right: 10px;
}
.lb-prev {
  left: 10px;
}
.lb-next {
  right: 10px;
}

.lb-counter {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 14px;
  letter-spacing: 2px;
}

@media (max-width: 640px) {
  .gallery-slider {
    padding: 40px 12px;
  }
  .lb-nav,
  .lb-close {
    width: 38px;
    height: 38px;
  }
}
</style>
