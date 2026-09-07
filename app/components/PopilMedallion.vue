<script setup>
import { useId } from "vue";

/**
 * The popil (ពពិល) — the winged, candle-bearing disc that elders pass
 * clockwise around the couple three times during បង្វិលពពិល, the blessing
 * that closes a Khmer wedding. Here it frames the couple's names and
 * keeps turning, slowly, in the same direction the elders pass it.
 *
 * This is the one ornamental moment on the page. Everything else stays a
 * hairline.
 */
const foilId = `popil-foil-${useId()}`;
</script>

<template>
  <div class="popil">
    <svg class="popil-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient :id="foilId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FBEFC0" />
          <stop offset="30%" stop-color="#F0D78A" />
          <stop offset="55%" stop-color="#D4A843" />
          <stop offset="78%" stop-color="#8A6320" />
          <stop offset="100%" stop-color="#F4E2A6" />
        </linearGradient>
      </defs>

      <!-- Twelve flame-vine petals, turning clockwise. -->
      <g
        class="popil-petals"
        fill="none"
        :stroke="`url(#${foilId})`"
        stroke-width="1.4"
        stroke-linejoin="round"
      >
        <path
          v-for="n in 12"
          :key="n"
          d="M100 8c5 8 7 13.5 0 22-7-8.5-5-14 0-22Z"
          :transform="`rotate(${(n - 1) * 30} 100 100)`"
        />
      </g>

      <!-- The disc itself: one drawn ring, one quiet ring inside it. -->
      <circle
        class="popil-ring-mid"
        cx="100"
        cy="100"
        r="72"
        fill="none"
        :stroke="`url(#${foilId})`"
        stroke-width="1.6"
      />
      <circle
        class="popil-ring-inner"
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="#8A6320"
        stroke-opacity="0.55"
        stroke-width="0.8"
      />
    </svg>

    <!-- The lit wick at the crown. -->
    <span class="popil-flame" aria-hidden="true"></span>

    <div class="popil-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.popil {
  --popil-size: clamp(290px, 82vw, 430px);

  position: relative;
  width: var(--popil-size);
  height: var(--popil-size);
  margin: 0 auto;
  display: grid;
  place-items: center;
}

.popil-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.55));
}

/* Passed clockwise, the way the popil actually travels. */
.popil-petals {
  transform-origin: 100px 100px;
  animation: popil-turn 90s linear infinite;
}

/* The ring draws itself once on load, then holds. */
.popil-ring-mid {
  stroke-dasharray: 453;
  stroke-dashoffset: 453;
  animation: popil-draw 2.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.25s forwards;
}

.popil-ring-inner {
  opacity: 0;
  animation: popil-fade 1.2s ease-out 2.1s forwards;
}

/* Candlelight at the crown of the disc. */
.popil-flame {
  position: absolute;
  top: calc(var(--popil-size) * 0.012);
  left: 50%;
  width: 9px;
  height: 15px;
  margin-left: -4.5px;

  border-radius: 50% 50% 50% 50% / 68% 68% 32% 32%;
  background: linear-gradient(180deg, #fff6d8 0%, #f0d78a 38%, #d4a843 68%, #6e1f2a 100%);
  box-shadow: 0 0 18px 5px rgba(212, 168, 67, 0.45);

  opacity: 0;
  animation:
    popil-fade 0.9s ease-out 1.7s forwards,
    popil-flicker 2.6s ease-in-out 2.6s infinite;
}

.popil-content {
  position: relative;
  z-index: 1;
  width: 74%;
  text-align: center;
}

@keyframes popil-turn {
  to {
    transform: rotate(360deg);
  }
}

@keyframes popil-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes popil-fade {
  to {
    opacity: 1;
  }
}

@keyframes popil-flicker {
  0%, 100% {
    transform: scaleY(1) scaleX(1);
    opacity: 1;
  }
  40% {
    transform: scaleY(1.16) scaleX(0.92);
    opacity: 0.86;
  }
  70% {
    transform: scaleY(0.94) scaleX(1.05);
    opacity: 1;
  }
}

/* With motion reduced the ring is simply already drawn and still. */
@media (prefers-reduced-motion: reduce) {
  .popil-ring-mid {
    stroke-dashoffset: 0;
  }
  .popil-ring-inner,
  .popil-flame {
    opacity: 1;
  }
}
</style>
