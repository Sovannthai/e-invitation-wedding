<script setup>
const { t } = useLang();
</script>

<template>
  <v-container id="location" class="py-10 text-center">
    <h2 class="section-title text-xxxl mb-4" data-aos="fade-up">{{ t("location.title") }}</h2>
    <iframe
      data-aos="zoom-in-up"
      src="https://maps.google.com/maps?q=phnom%20penh&t=&z=13&ie=UTF8&iwloc=&output=embed"
      width="100%"
      height="350"
      style="border-radius: 16px; border: none"
    ></iframe>
  </v-container>
</template>
