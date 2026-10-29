<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";

const { t } = useLang();

/* ---- Photos ----
   Every photo in /img/pre-wedding, by name and orientation (P portrait,
   L landscape). Each has two web copies made from the camera original:
   thumb/ (800px, for the grid) and web/ (1800px, for the preview). The
   originals run 5–13MB apiece and are never loaded. */
const RAW =
  "138a0019:P 138a0064:P 138a0081:P 138a0154:P 138a0177:L 138a0197:L " +
  "138a0210:L 138a0229:L 138a0233:L 138a0270:L 138a0354:L 138a0408:P " +
  "138a0446:L 138a0552:L 138a0621:L 138a0673:P 138a9909:P 138a9956:L " +
  "138a9968:P 248a9936:L 248a9975:P 248a9994:P img_6168:L img_6186:L " +
  "img_6217:L img_6484:L " +
  "img_1172:P img_1180:P img_1184:P img_1189:P img_1190:P img_1192:P " +
  "img_1196:P img_1202:P img_1203:P img_1206:P img_1209:P img_1211:P " +
  "img_1216:P img_1218:P img_1220:P";

const all = RAW.split(" ").map((s) => {
  const [name, o] = s.split(":");
  return {
    name,
    o,
    thumb: `/img/pre-wedding/thumb/${name}.jpg`,
    full: `/img/pre-wedding/web/${name}.jpg`,
  };
});

/* Mix the two shoots evenly through the gallery rather than showing one
   after the other: always draw next from whichever set is furthest behind
   its share. */
function mix(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (j >= b.length || (i < a.length && i / a.length <= j / b.length)) out.push(a[i++]);
    else out.push(b[j++]);
  }
  return out;
}

const photos = mix(
  all.filter((p) => !p.name.startsWith("img_1")),
  all.filter((p) => p.name.startsWith("img_1"))
);

/* ---- Page layouts ----
   Each page is a 4:5 board laid out with grid areas. Every cell is tagged
   with the shape it gives a photo — P tall, L wide, S near-square — so
   portraits land in tall cells and landscapes in wide ones and as little
   as possible is cropped away. Wide cells are kept near 1.6:1, close to
   the camera's 3:2; anything wider cut the couple off at the knees. */
const LAYOUTS = {
  4: [
    {
      // two tall over two near-square (0.67 / 1.0)
      cols: "1fr 1fr",
      rows: "3fr 2fr",
      areas: ["a b", "c d"],
      cells: { a: "P", b: "P", c: "S", d: "S" },
    },
    {
      // a tall beside two wide, one wide across the foot (0.8 / 1.6)
      cols: "1fr 1fr",
      rows: "1fr 1fr 2fr",
      areas: ["a b", "a c", "d d"],
      cells: { a: "P", b: "L", c: "L", d: "L" },
    },
  ],
  5: [
    {
      // a tall beside two, two more below (0.6 / 1.2)
      cols: "1fr 1fr",
      rows: "1fr 1fr 1fr",
      areas: ["a b", "a c", "d e"],
      cells: { a: "P", b: "S", c: "S", d: "S", e: "S" },
    },
  ],
  6: [
    {
      cols: "1fr 1fr 1fr",
      rows: "1fr 1fr 1fr",
      areas: ["a a b", "a a c", "d e f"],
      cells: { a: "P", b: "S", c: "S", d: "S", e: "S", f: "S" },
    },
  ],
};

/* Page sizes run 5, 4, 6, 4 … The last page is never left with fewer than
   four photos: any shortfall is taken one at a time from earlier pages. */
function pageSizes(total) {
  const cycle = [5, 4, 6, 4];
  const sizes = [];
  let sum = 0;
  while (sum < total) {
    const s = cycle[sizes.length % cycle.length];
    sizes.push(Math.min(s, total - sum));
    sum += sizes[sizes.length - 1];
  }
  let short = 4 - sizes[sizes.length - 1];
  for (let k = sizes.length - 2; short > 0 && k >= 0; k--) {
    if (sizes[k] > 4) {
      sizes[k] -= 1;
      sizes[sizes.length - 1] += 1;
      short -= 1;
    }
  }
  return sizes;
}

const pages = (() => {
  const queue = [...photos];
  const seen = { 4: 0, 5: 0, 6: 0 };
  return pageSizes(queue.length).map((size) => {
    const options = LAYOUTS[size] || LAYOUTS[4];
    const layout = options[seen[size]++ % options.length];
    const items = Object.entries(layout.cells).map(([area, shape]) => {
      // Look a few photos ahead for one of the right orientation, so the
      // mix stays close to its order without forcing a bad crop.
      let k = queue.findIndex((p, n) => n < 6 && (shape === "S" || p.o === shape));
      if (k < 0) k = 0;
      return { ...queue.splice(k, 1)[0], area };
    });
    return { layout, items };
  });
})();

/* The preview steps through photos in the order they appear on the pages. */
const ordered = pages.flatMap((p) => p.items);
const indexOf = new Map(ordered.map((p, i) => [p.name, i]));

const gridStyle = (layout) => ({
  gridTemplateColumns: layout.cols,
  gridTemplateRows: layout.rows,
  gridTemplateAreas: layout.areas.map((r) => `"${r}"`).join(" "),
});

/* ---- List ----
   The boards run down the page. The first four — one of each layout —
   show straight away; the button reveals the rest, and folds them away
   again so the list never strands a guest far below the gallery. */
const FIRST = 4;
const expanded = ref(false);
const moreBtn = ref(null);

const visiblePages = computed(() =>
  expanded.value ? pages : pages.slice(0, FIRST)
);
const hiddenCount = pages
  .slice(FIRST)
  .reduce((n, p) => n + p.items.length, 0);

async function toggleMore() {
  expanded.value = !expanded.value;
  if (!expanded.value) {
    // Folding up removes everything above the button's new place, so bring
    // the guest back to it rather than leaving them further down the page.
    // The leaving boards are only taken out of the DOM a frame or two after
    // the change, so wait for that before measuring.
    await nextTick();
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        moreBtn.value?.scrollIntoView({ block: "center" })
      )
    );
  }
}

/* ---- Preview ---- */
const lightbox = ref(false);
const current = ref(0);
const shown = computed(() => ordered[current.value]);

function openPreview(name) {
  current.value = indexOf.get(name) ?? 0;
  lightbox.value = true;
}

function step(d) {
  current.value = (current.value + d + ordered.length) % ordered.length;
}

/* Warm the neighbours so stepping through feels instant. */
watch(current, (i) => {
  [i - 1, i + 1].forEach((n) => {
    const p = ordered[(n + ordered.length) % ordered.length];
    const img = new Image();
    img.src = p.full;
  });
});

function onKey(e) {
  if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
}

watch(lightbox, (open) => {
  if (open) window.addEventListener("keydown", onKey);
  else window.removeEventListener("keydown", onKey);
});

onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

/* Horizontal swipe on phones. */
let touchX = null;
function onTouchStart(e) {
  touchX = e.touches[0].clientX;
}
function onTouchEnd(e) {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
}
</script>

<template>
  <section id="gallery" class="gallery">
    <h2 class="section-title text-center" data-aos="fade-up">
      {{ t("gallery.title") }}
    </h2>
    <p class="gallery-hint" data-aos="fade-up" data-aos-delay="60">
      {{ t("gallery.hint") }}
    </p>

    <TransitionGroup tag="div" name="board" class="gallery-list">
      <div
        v-for="(page, pi) in visiblePages"
        :key="pi"
        class="board"
        :style="gridStyle(page.layout)"
      >
        <button
          v-for="p in page.items"
          :key="p.name"
          type="button"
          class="tile"
          :style="{ gridArea: p.area }"
          :aria-label="`${t('gallery.title')} ${indexOf.get(p.name) + 1}`"
          @click="openPreview(p.name)"
        >
          <img
            :src="p.thumb"
            :style="{ objectPosition: p.o === 'P' ? '50% 30%' : '50% 50%' }"
            loading="lazy"
            decoding="async"
            alt=""
          />
        </button>
      </div>
    </TransitionGroup>

    <div v-if="pages.length > FIRST" class="gallery-more">
      <button
        ref="moreBtn"
        type="button"
        class="more-btn"
        :aria-expanded="expanded"
        @click="toggleMore"
      >
        <v-icon>{{ expanded ? "mdi-chevron-up" : "mdi-image-multiple-outline" }}</v-icon>
        {{ expanded ? t("gallery.less") : `${t("gallery.more")} (${hiddenCount})` }}
      </button>
    </div>

    <!-- Preview -->
    <v-dialog v-model="lightbox" fullscreen transition="fade-transition">
      <div
        class="lightbox"
        @click.self="lightbox = false"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div class="lb-bar">
          <span class="lb-count">{{ current + 1 }} / {{ ordered.length }}</span>
          <button class="lb-btn" aria-label="Close" @click="lightbox = false">
            <v-icon>mdi-close</v-icon>
          </button>
        </div>

        <Transition name="lb-fade" mode="out-in">
          <img
            :key="shown.name"
            :src="shown.full"
            class="lb-img"
            alt=""
            @click.stop
          />
        </Transition>

        <button class="lb-btn lb-nav lb-prev" aria-label="Previous" @click="step(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </button>
        <button class="lb-btn lb-nav lb-next" aria-label="Next" @click="step(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </button>
      </div>
    </v-dialog>
  </section>
</template>

<style scoped>
.gallery {
  padding: 56px 16px;
}

.section-title {
  margin-bottom: 4px;
}

.gallery-hint {
  margin: 0 0 22px;
  text-align: center;
  font-size: clamp(12px, 3vw, 14px);
  color: var(--ink-soft);
}

/* Boards stack in one column on upright screens (phones, tablets held
   tall). On any wide screen — laptops, tablets on their side, phones turned
   — they pair up two to a row, and the row is sized from the window height
   as well, so a whole 4:5 board always fits on screen. */
.gallery-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(14px, 3vw, 22px);
  width: min(100%, 560px);
  margin: 0 auto;
}

@media (orientation: landscape) {
  .gallery-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(100%, 1040px, calc((100vh - 40px) * 1.6 + 22px));
  }
}

/* Revealed boards rise in one after another. */
.board-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.board-enter-active:nth-child(5n + 2) { transition-delay: 0.08s; }
.board-enter-active:nth-child(5n + 3) { transition-delay: 0.16s; }
.board-enter-active:nth-child(5n + 4) { transition-delay: 0.24s; }
.board-enter-active:nth-child(5n + 5) { transition-delay: 0.32s; }

.board-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

/* Folding away is instant, so the page doesn't stall on long fades. */
.board-leave-active {
  display: none;
}

/* ---- See more ---- */
.gallery-more {
  display: flex;
  justify-content: center;
  margin-top: clamp(20px, 4vw, 30px);
}

.more-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 28px;
  border: none;
  border-radius: 999px;
  font: inherit;
  font-size: clamp(14px, 3.4vw, 16px);
  color: #fff;
  background: linear-gradient(180deg, #e6c25c, #c8971f);
  box-shadow: 0 10px 24px rgba(200, 151, 31, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(200, 151, 31, 0.45);
}

.more-btn :deep(.v-icon) {
  font-size: 20px;
}

.board {
  display: grid;
  gap: 8px;
  aspect-ratio: 4 / 5;
  padding: 8px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--surface-edge);
  box-shadow: 0 14px 34px rgba(80, 90, 70, 0.16);
}

.tile {
  position: relative;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: #e9e4d6;
  cursor: zoom-in;
}

.tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tile::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  pointer-events: none;
}

.tile:hover img {
  transform: scale(1.05);
}

.tile:focus-visible {
  outline: 2px solid #c8971f;
  outline-offset: 2px;
}

/* ---- Preview ---- */
.lightbox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 64px 12px 24px;
  background: rgba(14, 13, 9, 0.94);
}

.lb-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  user-select: none;
  -webkit-user-drag: none;
}

.lb-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.lb-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.lb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 0.2s ease;
}

.lb-btn:hover {
  background: rgba(216, 174, 70, 0.55);
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.lb-prev {
  left: 14px;
}

.lb-next {
  right: 14px;
}

.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.25s ease;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

/* Phones swipe through the preview, so the arrows sit low and out of the
   way of the photo. */
@media (max-width: 640px) {
  .gallery {
    padding: 40px 12px;
  }
  .board {
    gap: 6px;
    padding: 6px;
    border-radius: 18px;
  }
  .tile {
    border-radius: 12px;
  }
  .lb-nav {
    top: auto;
    bottom: 18px;
    transform: none;
  }
  .lb-prev {
    left: calc(50% - 54px);
  }
  .lb-next {
    right: calc(50% - 54px);
  }
  .lightbox {
    padding-bottom: 80px;
  }
}
</style>
