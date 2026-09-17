<script setup>
import { ref, onBeforeUnmount } from "vue";

const { t } = useLang();

/* The audio element is created on first press rather than at load, so no
   file is fetched for a guest who never turns the music on. */
let audio = null;
const playing = ref(false);

async function toggle() {
  if (!audio) {
    audio = new Audio("/music/mp3.webm");
    audio.loop = true;
    // Keep the button honest if playback stops for any other reason.
    audio.addEventListener("play", () => (playing.value = true));
    audio.addEventListener("pause", () => (playing.value = false));
  }

  if (audio.paused) {
    try {
      await audio.play();
    } catch {
      // Browsers reject play() when they judge it un-gestured; leave the
      // button showing "stopped" rather than lying about the state.
      playing.value = false;
    }
  } else {
    audio.pause();
  }
}

onBeforeUnmount(() => {
  audio?.pause();
  audio = null;
});
</script>

<template>
  <button
    class="music-btn"
    :class="{ 'is-playing': playing }"
    :aria-label="t(playing ? 'nav.musicPause' : 'nav.musicPlay')"
    :aria-pressed="playing"
    :title="t(playing ? 'nav.musicPause' : 'nav.musicPlay')"
    @click="toggle"
  >
    <v-icon>{{ playing ? "mdi-music" : "mdi-music-off" }}</v-icon>
  </button>
</template>

<style scoped>
/* Top-left, aligned on the same line as the language switcher (top-right) */
.music-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  /* Above the envelope (9999) so the same single player is reachable on the
     sealed envelope as well as the invitation behind it. One button, one
     audio element, one play state. */
  z-index: 10001;

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

/* Playing reads as a lit button, so the state is visible as well as
   announced — the icon alone is easy to miss at this size. */
.music-btn.is-playing {
  color: #16273c;
  background: linear-gradient(180deg, #fdf3c4, #d8ae46);
  box-shadow: 0 0 0 1px rgba(216, 174, 70, 0.8), 0 0 14px rgba(216, 174, 70, 0.45);
}

.music-btn :deep(.v-icon) {
  font-size: 20px;
}
</style>
