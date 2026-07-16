<script setup>
let audio = null;

function toggle() {
  if (!audio) {
    audio = new Audio("/music/mp3.webm");
    audio.loop = true;
  }
  audio.paused ? audio.play() : audio.pause();
}
</script>

<template>
  <v-btn icon color="#C8A96A" class="music-btn" @click="toggle">
    <v-icon>mdi-music</v-icon>
  </v-btn>
</template>

<style scoped>
.music-btn {
  position: fixed;
  bottom: 78px; /* sit above the section nav pill */
  right: 20px;
  z-index: 1500;
}
</style>
