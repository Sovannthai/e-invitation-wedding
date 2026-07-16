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
  <button class="music-btn" aria-label="Play music" @click="toggle">
    <v-icon>mdi-music</v-icon>
  </button>
</template>

<style scoped>
/* Top-left, aligned on the same line as the language switcher (top-right) */
.music-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 2000;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;

  border: none;
  border-radius: 50%;
  cursor: pointer;

  color: #f3e2b0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 0 1px rgba(216, 174, 70, 0.6);
  transition: 0.2s;
}

.music-btn:hover {
  color: #16273c;
  background: linear-gradient(180deg, #fdf3c4, #d8ae46);
}

.music-btn :deep(.v-icon) {
  font-size: 20px;
}
</style>
