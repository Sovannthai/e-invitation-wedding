<script setup>
import { ref, computed, onMounted } from "vue";

const open = defineModel({ type: Boolean, default: false });

const { t, locale } = useLang();

/* There is no backend yet, so wishes live in this browser only. Swap
   load/save for an API call to share them between guests. */
const STORAGE_KEY = "wedding-wishes";

const wishes = ref([]);
const name = ref("");
const message = ref("");
const sent = ref(false);

const quickWishes = computed(() =>
  [1, 2, 3, 4].map((n) => t(`wish.quick${n}`))
);

const canSend = computed(
  () => name.value.trim().length > 0 && message.value.trim().length > 0
);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    wishes.value = raw ? JSON.parse(raw) : [];
  } catch {
    wishes.value = [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes.value));
  } catch {
    /* storage blocked — the wish still shows for this visit */
  }
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString(locale.value === "km" ? "km-KH" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pickQuick(text) {
  message.value = text;
}

function send() {
  if (!canSend.value) return;
  wishes.value.unshift({
    id: Date.now(),
    name: name.value.trim(),
    message: message.value.trim(),
    at: Date.now(),
  });
  save();
  message.value = "";
  sent.value = true;
  setTimeout(() => (sent.value = false), 2400);
}

onMounted(load);
</script>

<template>
  <v-dialog v-model="open" max-width="620" scrollable>
    <div class="wish-card">
      <button class="wish-close" :aria-label="t('wish.close')" @click="open = false">
        <v-icon>mdi-close</v-icon>
      </button>

      <header class="wish-head">
        <h3 class="wish-title">
          <v-icon class="wish-heart">mdi-heart</v-icon>
          {{ t("wish.title") }}
        </h3>
        <p class="wish-sub">{{ t("wish.subtitle") }}</p>
      </header>

      <!-- Wishes already sent -->
      <div class="wish-list">
        <p v-if="!wishes.length" class="wish-empty">{{ t("wish.empty") }}</p>
        <article v-for="w in wishes" :key="w.id" class="wish-item">
          <div class="wish-item-head">
            <span class="wish-dot" aria-hidden="true"></span>
            <strong class="wish-name">{{ w.name }}</strong>
            <time class="wish-time">{{ formatTime(w.at) }}</time>
          </div>
          <p class="wish-text">{{ w.message }}</p>
        </article>
      </div>

      <!-- Quick wishes fill the message box -->
      <div class="wish-quick">
        <p class="wish-quick-label">
          <v-icon>mdi-creation</v-icon>{{ t("wish.quickLabel") }}
        </p>
        <div class="wish-quick-chips">
          <button
            v-for="(q, i) in quickWishes"
            :key="i"
            type="button"
            class="wish-chip"
            :title="q"
            @click="pickQuick(q)"
          >
            {{ q }}
          </button>
        </div>
      </div>

      <form class="wish-form" @submit.prevent="send">
        <input
          v-model="name"
          class="wish-input"
          type="text"
          maxlength="60"
          :placeholder="t('wish.name')"
        />
        <textarea
          v-model="message"
          class="wish-input wish-textarea"
          rows="3"
          maxlength="500"
          :placeholder="t('wish.message')"
        ></textarea>

        <p v-if="sent" class="wish-sent">{{ t("wish.thanks") }}</p>

        <div class="wish-actions">
          <button type="button" class="wish-btn wish-btn--ghost" @click="open = false">
            {{ t("wish.close") }}
          </button>
          <button type="submit" class="wish-btn wish-btn--send" :disabled="!canSend">
            <v-icon>mdi-send-outline</v-icon>{{ t("wish.send") }}
          </button>
        </div>
      </form>
    </div>
  </v-dialog>
</template>

<style scoped>
.wish-card {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  padding: clamp(22px, 4vw, 36px);
  border-radius: 28px;
  background: #fff;
  border: 1px solid rgba(216, 174, 70, 0.35);
  box-shadow: 0 24px 60px rgba(40, 40, 30, 0.25);
  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  color: var(--ink);
}

.wish-close {
  position: absolute;
  top: 18px;
  right: 18px;
  display: inline-flex;
  padding: 6px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
}
.wish-close:hover {
  background: rgba(216, 174, 70, 0.15);
}

/* ---- Header ---- */
.wish-head {
  padding-right: 36px;
  margin-bottom: 18px;
}

.wish-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-family: "Lexend", "Moul", serif;
  font-size: clamp(18px, 4.4vw, 24px);
  line-height: 1.6;
  color: var(--heading);
}

.wish-heart {
  font-size: 26px !important;
  color: #e0475b;
}

.wish-sub {
  margin: 4px 0 0;
  font-size: clamp(12px, 3vw, 14px);
  line-height: 1.8;
  color: var(--ink-soft);
}

/* ---- List ---- */
.wish-list {
  flex: 1 1 auto;
  min-height: 80px;
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.wish-empty {
  margin: auto 0;
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: var(--ink-soft);
}

.wish-item {
  padding: 14px 18px;
  border-radius: 18px;
  background: #fffdf3;
  border: 1px solid rgba(230, 194, 92, 0.45);
}

.wish-item-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wish-dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e0607a;
}

.wish-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: var(--heading);
}

.wish-time {
  flex: 0 0 auto;
  font-family: "Lexend", serif;
  font-size: 12px;
  color: var(--ink-soft);
}

.wish-text {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.85;
  word-break: break-word;
  white-space: pre-line;
}

/* ---- Quick wishes ---- */
.wish-quick {
  margin-top: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(157, 128, 70, 0.15);
}

.wish-quick-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--ink-soft);
}
.wish-quick-label :deep(.v-icon) {
  font-size: 18px;
  color: var(--gold);
}

.wish-quick-chips {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.wish-chip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(157, 128, 70, 0.2);
  background: #f6f7f9;
  font: inherit;
  font-size: 13px;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.wish-chip:hover {
  background: #fffaea;
  border-color: rgba(216, 174, 70, 0.6);
}

/* ---- Form ---- */
.wish-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.wish-input {
  width: 100%;
  padding: 12px 18px;
  border-radius: 16px;
  border: 1px solid rgba(157, 128, 70, 0.25);
  background: #fff;
  font: inherit;
  font-size: 15px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.wish-input:focus {
  border-color: #d8ae46;
  box-shadow: 0 0 0 3px rgba(216, 174, 70, 0.2);
}

.wish-textarea {
  resize: none;
  line-height: 1.8;
}

.wish-sent {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #4f8a5b;
}

.wish-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 6px;
}

.wish-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}
.wish-btn:active {
  transform: scale(0.98);
}

.wish-btn--ghost {
  background: #f1f3f6;
  color: var(--heading);
}

.wish-btn--send {
  color: #fff;
  background: linear-gradient(90deg, #d8ae46, #c8971f 45%, #d9475b);
  box-shadow: 0 10px 24px rgba(200, 120, 60, 0.3);
}
.wish-btn--send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .wish-card {
    border-radius: 22px;
  }
  .wish-quick-chips {
    grid-template-columns: minmax(0, 1fr);
  }
  .wish-list {
    max-height: 200px;
  }
}
</style>
