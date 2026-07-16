<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const images = [
  "/img/gallery1.jpg",
  "/img/gallery2.jpg",
  "/img/envelope.jpg",
  "/img/gallery2.jpg",
];

// Responsive slides: 1 on phones, 2 on tablet/laptop and up
const breakpoints = {
  0: { slidesPerView: 1, spaceBetween: 12 },
  641: { slidesPerView: 2, spaceBetween: 20 },
};

const { t } = useLang();
</script>

<template>
  <section id="gallery" class="gallery-slider">
    <h2 class="section-title text-center text-xxl mb-4">{{ t("gallery.title") }}</h2>

    <Swiper :breakpoints="breakpoints" loop>
      <SwiperSlide v-for="img in images" :key="img">
        <img :src="img" class="slide-img" />
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.gallery-slider {
  padding: 56px 20px;
  /* No own background – shows the single site background */
  background: transparent;
}

.slide-img {
  width: 100%;
  height: 500px;

  object-fit: cover;
  border-radius: 20px;
}

@media (max-width: 640px) {
  .gallery-slider {
    padding: 36px 16px;
  }
  .slide-img {
    height: 300px;
  }
}
</style>
