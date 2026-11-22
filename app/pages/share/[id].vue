<script setup>
/* For the couple, not the guest: the invitation message for one guest, in
   Khmer and in English, with their name and personal link already filled in
   and a button to copy each. Opened from the guest's page in Directus
   ("Copy invitation text"). The texts can be edited here before copying;
   edits are not saved. */
import { ref, watch } from "vue";

const route = useRoute();
const id = String(route.params.id);

const { data: guest, error } = await useFetch(`/api/guests/${id}`, {
  key: `guest-${id}`,
});

const link = `${window.location.origin}/${id}`;

function khmer(name) {
  return `សូមគោរពអញ្ជើញ ${name}

យើងខ្ញុំ សុវណ្ណថៃ និង សុហេង ព្រមទាំងមាតាបិតាទាំងសងខាង មានកិត្តិយសសូមគោរពអញ្ជើញ លោកអ្នក ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ សិរីមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ ដែលនឹងប្រព្រឹត្តទៅនៅ៖

ថ្ងៃសៅរ៍ ទី១៩ ខែធ្នូ ឆ្នាំ២០២៦
វេលាម៉ោង ៥:០០ ល្ងាច

សូមចុចតំណខាងក្រោម ដើម្បីមើលលិខិតអញ្ជើញ កម្មវិធី និងផែនទីទីតាំង៖
${link}

វត្តមានដ៏ខ្ពង់ខ្ពស់របស់ លោកអ្នក គឺជាកិត្តិយស និងជាសិរីមង្គលសម្រាប់គ្រួសារយើងខ្ញុំ។

សូមអរគុណ និងសូមគោរពរង់ចាំទទួលដោយក្តីសោមនស្សរីករាយ 🙏

ដោយក្តីគោរពដ៏ខ្ពង់ខ្ពស់
សុវណ្ណថៃ និង សុហេង`;
}

function english(name) {
  return `Dear ${name},

Together with our families, we, Sovannthai and Soheng, have the honour of inviting you to join us as our honoured guest and to bless us at our wedding ceremony, which will be held on:

Saturday, 19 December 2026
at 5:00 PM

Please open the link below for your invitation, the programme and the map to the venue:
${link}

Your presence would be a great honour and a blessing for our families.

Thank you. We look forward to welcoming you 🙏

With our deepest respect,
Sovannthai & Soheng`;
}

const messages = ref([]);
watch(
  guest,
  (g) => {
    const name = g?.name ?? "";
    messages.value = name
      ? [
          { key: "km", label: "ភាសាខ្មែរ", lang: "km", text: khmer(name) },
          { key: "en", label: "English", lang: "en", text: english(name) },
        ]
      : [];
  },
  { immediate: true }
);

/* Which button last copied, so it can say so for a moment. */
const copied = ref("");
let copiedTimer = null;

async function copy(key, text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Older browsers, or a page that isn't allowed the clipboard API
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  copied.value = key;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => (copied.value = ""), 2000);
}

useHead({
  title: "Invitation text",
  meta: [{ name: "robots", content: "noindex" }],
});
</script>

<template>
  <main class="share">
    <header class="share-head">
      <h1 class="share-title">Invitation text</h1>
      <p v-if="guest" class="share-guest">{{ guest.name }}</p>
      <p v-else class="share-missing">
        {{ error ? "This guest was not found. Open this page from a saved guest in Directus." : "Loading…" }}
      </p>
    </header>

    <template v-if="guest">
      <section class="share-card share-link">
        <div class="share-row">
          <h2 class="share-label">Invitation link</h2>
          <button class="share-btn" :class="{ 'is-done': copied === 'link' }" @click="copy('link', link)">
            <v-icon>{{ copied === "link" ? "mdi-check" : "mdi-content-copy" }}</v-icon>
            {{ copied === "link" ? "Copied" : "Copy link" }}
          </button>
        </div>
        <a class="share-url" :href="link" target="_blank" rel="noopener">{{ link }}</a>
      </section>

      <section v-for="m in messages" :key="m.key" class="share-card">
        <div class="share-row">
          <h2 class="share-label">{{ m.label }}</h2>
          <button class="share-btn" :class="{ 'is-done': copied === m.key }" @click="copy(m.key, m.text)">
            <v-icon>{{ copied === m.key ? "mdi-check" : "mdi-content-copy" }}</v-icon>
            {{ copied === m.key ? "Copied" : "Copy text" }}
          </button>
        </div>
        <textarea
          v-model="m.text"
          class="share-text"
          :lang="m.lang"
          :aria-label="`${m.label} invitation text`"
          rows="18"
        ></textarea>
      </section>

      <p class="share-note">You can edit a text before copying. Edits are not saved.</p>
    </template>
  </main>
</template>

<style scoped>
.share {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(20px, 5vw, 48px) 16px 64px;
  font-family: "Lexend", "Kantumruy Pro", sans-serif;
  color: var(--ink);
}

.share-head {
  margin-bottom: 20px;
  text-align: center;
}

.share-title {
  margin: 0;
  font-size: 22px;
  color: var(--heading);
}

.share-guest {
  margin: 6px 0 0;
  font-size: 18px;
  color: var(--gold);
}

.share-missing {
  margin: 12px 0 0;
  color: var(--ink-soft);
}

.share-card {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid var(--surface-edge);
}

.share-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.share-label {
  margin: 0;
  font-size: 15px;
  color: var(--heading);
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: var(--gold);
  color: #fff;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.share-btn.is-done {
  background: #4f8a5b;
}

.share-btn :deep(.v-icon) {
  font-size: 18px;
}

.share-url {
  display: block;
  font-size: 14px;
  color: var(--ink-soft);
  word-break: break-all;
}

.share-text {
  display: block;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(157, 128, 70, 0.25);
  background: #fff;
  font: inherit;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink);
  resize: vertical;
}

.share-text:focus {
  outline: none;
  border-color: #d8ae46;
  box-shadow: 0 0 0 3px rgba(216, 174, 70, 0.2);
}

.share-note {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--ink-soft);
}
</style>
