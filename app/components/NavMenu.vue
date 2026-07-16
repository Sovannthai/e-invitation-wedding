<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const { t } = useLang();

const items = [
  { id: "home", icon: "mdi-home-variant", labelKey: "nav.home" },
  { id: "countdown", icon: "mdi-timer-sand", labelKey: "countdown.title" },
  { id: "story", icon: "mdi-heart", labelKey: "story.title" },
  { id: "event", icon: "mdi-calendar-heart", labelKey: "event.title" },
  { id: "gallery", icon: "mdi-camera", labelKey: "gallery.title" },
  { id: "location", icon: "mdi-map-marker", labelKey: "location.title" },
  { id: "rsvp", icon: "mdi-email-outline", labelKey: "rsvp.title" },
  { id: "gift", icon: "mdi-qrcode", labelKey: "payment.title" },
];

const visible = ref(false);
const active = ref("home");

let observer = null;

function onScroll() {
  // Show the menu once the user scrolls past the top of the hero
  visible.value = window.scrollY > 200;
}

function go(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the section closest to the middle of the viewport
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) active.value = e.target.id;
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  items.forEach((i) => {
    const el = document.getElementById(i.id);
    if (el) observer.observe(el);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  if (observer) observer.disconnect();
});
</script>

<template>
  <Transition name="nav-fade">
    <nav v-show="visible" class="nav-pill" aria-label="Section navigation">
      <button
        v-for="item in items"
        :key="item.id"
        class="nav-item"
        :class="{ active: active === item.id }"
        :title="t(item.labelKey)"
        :aria-label="t(item.labelKey)"
        @click="go(item.id)"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </button>
    </nav>
  </Transition>
</template>

<style scoped>
.nav-pill {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1500;

  display: flex;
  align-items: center;
  gap: 2px;

  max-width: calc(100vw - 24px);
  padding: 6px 8px;

  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(216, 174, 70, 0.5);

  overflow-x: auto;
  scrollbar-width: none;
}
.nav-pill::-webkit-scrollbar {
  display: none;
}

.nav-item {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #7a6a3a;
  cursor: pointer;
  transition: all 0.25s ease;
}

.nav-item :deep(.v-icon) {
  font-size: 22px;
}

.nav-item:hover {
  color: #b8862b;
  background: rgba(216, 174, 70, 0.15);
}

/* Active section – filled gold circle */
.nav-item.active {
  color: #ffffff;
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  box-shadow: 0 6px 14px rgba(200, 151, 31, 0.45);
  transform: translateY(-4px);
}

/* Fade / slide transition */
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.nav-fade-enter-from,
.nav-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 640px) {
  .nav-item {
    width: 38px;
    height: 38px;
  }
  .nav-item :deep(.v-icon) {
    font-size: 20px;
  }
}
</style>
