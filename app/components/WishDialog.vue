<script setup>
import { ref, computed, watch, inject } from "vue";

const open = defineModel({ type: Boolean, default: false });

const { t, locale } = useLang();
const route = useRoute();

/* Wishes are kept in Directus and shared by every guest; the browser talks
   to this site's own /api/wishes (server/api/wishes), never to Directus. */
const wishes = ref([]);
const name = ref("");

/* A guest on their personal link is already known by name: the field shows
   it and is locked, and the server signs the wish with the name on their
   invitation whatever the browser sends. On the general link it is theirs
   to type. */
const guestName = inject("guestName", ref(""));
const named = computed(() => guestName.value.trim().length > 0);
watch(guestName, (n) => n && (name.value = n), { immediate: true });
const message = ref("");
const sent = ref(false);
const sending = ref(false);
const failed = ref(false);

const quickWishes = computed(() =>
  [1, 2, 3, 4].map((n) => t(`wish.quick${n}`))
);

const canSend = computed(
  () => !sending.value && name.value.trim().length > 0 && message.value.trim().length > 0
);

/* A failed load leaves whatever is already showing: the guestbook being
   unreachable shouldn't stop a guest reading or writing. */
async function load() {
  try {
    wishes.value = await $fetch("/api/wishes");
  } catch {
    /* keep the current list */
  }
}

/* Today's wishes show the time; older ones the date as well. */
function formatTime(ts) {
  const date = new Date(ts);
  const lang = locale.value === "km" ? "km-KH" : "en-US";
  const time = { hour: "2-digit", minute: "2-digit" };
  return date.toDateString() === new Date().toDateString()
    ? date.toLocaleTimeString(lang, time)
    : date.toLocaleString(lang, { day: "numeric", month: "short", ...time });
}

function pickQuick(text) {
  message.value = text;
}

async function send() {
  if (!canSend.value) return;
  sending.value = true;
  failed.value = false;
  try {
    const wish = await $fetch("/api/wishes", {
      method: "POST",
      body: {
        name: name.value.trim(),
        message: message.value.trim(),
        // On a personal link, lets the couple see whose invitation it came from.
        guest: typeof route.params.id === "string" ? route.params.id : undefined,
      },
    });
    wishes.value.unshift(wish);
    message.value = "";
    sent.value = true;
    setTimeout(() => (sent.value = false), 2400);
  } catch {
    failed.value = true;
  } finally {
    sending.value = false;
  }
}

/* Fetched each time the guestbook is opened, so it shows what others have
   written since. */
watch(open, (isOpen) => isOpen && load(), { immediate: true });
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
            <time class="wish-time">{{ formatTime(w.date_created) }}</time>
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
          :aria-label="t('wish.name')"
          :disabled="named"
        />
        <textarea
          v-model="message"
          class="wish-input wish-textarea"
          rows="3"
          maxlength="500"
          :placeholder="t('wish.message')"
        ></textarea>

        <p v-if="sent" class="wish-sent" role="status">{{ t("wish.thanks") }}</p>
        <p v-if="failed" class="wish-sent wish-failed" role="alert">{{ t("wish.error") }}</p>

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
  /* dvh follows the visible area on phones (address bar, keyboard), and the
     card scrolls as a whole so the form and Send button stay reachable on a
     short screen. */
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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
  flex: 0 0 auto;
  min-height: 80px;
  max-height: min(260px, 32dvh);
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
.wish-input:disabled {
  background: rgba(157, 128, 70, 0.08);
  color: var(--ink-soft);
  /* iOS Safari fades disabled text unless told otherwise */
  -webkit-text-fill-color: var(--ink-soft);
  opacity: 1;
  cursor: not-allowed;
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
.wish-failed {
  color: #b3473f;
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
    max-height: min(200px, 28dvh);
  }
}
</style>
