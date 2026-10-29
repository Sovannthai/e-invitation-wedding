<script setup>
const { locale, setLocale } = useLang();
</script>

<template>
  <div class="lang-switch">
    <button
      class="lang-btn"
      :class="{ active: locale === 'km' }"
      @click="setLocale('km')"
    >
      ខ្មែរ
    </button>
    <span class="divider">|</span>
    <button
      class="lang-btn"
      :class="{ active: locale === 'en' }"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.lang-switch {
  position: fixed;
  top: calc(16px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  /* Above the envelope (9999). The envelope's own wording is already
     translated; without this the switcher sat underneath it, so a guest
     could not choose a language until after opening. */
  z-index: 10001;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 0 1px rgba(216, 174, 70, 0.6);
}

.lang-btn {
  font-family: "Kantumruy Pro", sans-serif;
  font-size: 14px;
  color: #f3e2b0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 999px;
  transition: 0.2s;
}

.lang-btn.active {
  color: #16273c;
  background: linear-gradient(180deg, #fdf3c4, #d8ae46);
  font-weight: 600;
}

.divider {
  color: rgba(243, 226, 176, 0.5);
}
</style>
