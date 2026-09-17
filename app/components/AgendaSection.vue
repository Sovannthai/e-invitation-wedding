<script setup>
/**
 * The running order of the day, following the printed programme card:
 * an icon for each ceremony, an ornamented rail joining them, then the
 * hour and what happens at it.
 */
const { t } = useLang();

const agenda = [
  { icon: "mdi-umbrella-outline", timeKey: "agenda.t1", textKey: "agenda.d1" },
  { icon: "mdi-account-group", timeKey: "agenda.t2", textKey: "agenda.d2" },
  { icon: "mdi-ring", timeKey: "agenda.t3", textKey: "agenda.d3" },
  { icon: "mdi-content-cut", timeKey: "agenda.t4", textKey: "agenda.d4" },
  { icon: "mdi-hands-pray", timeKey: "agenda.t5", textKey: "agenda.d5" },
  { icon: "mdi-silverware-fork-knife", timeKey: "agenda.t6", textKey: "agenda.d6" },
  { icon: "mdi-home-heart", timeKey: "agenda.t7", textKey: "agenda.d7" },
];
</script>

<template>
  <section id="agenda" class="agenda-section">
    <div class="agenda-inner">
      <h2 class="section-title text-center" data-aos="fade-up">
        {{ t("agenda.title") }}
      </h2>

      <p class="agenda-date" data-aos="fade-up" data-aos-delay="60">
        <span>{{ t("agenda.dateLunar") }}</span>
        <span>{{ t("agenda.dateGregorian") }}</span>
      </p>

      <ol class="agenda-list">
        <li
          v-for="(item, i) in agenda"
          :key="item.timeKey"
          class="agenda-item"
          data-aos="fade-up"
          :data-aos-delay="60 + i * 60"
        >
          <span class="item-icon">
            <v-icon>{{ item.icon }}</v-icon>
          </span>

          <!-- Double hairline with a node at each ceremony, joining the
               whole day into one thread the way the printed card does. -->
          <span class="item-rail" aria-hidden="true"></span>

          <div class="item-body">
            <p class="item-time">{{ t(item.timeKey) }}</p>
            <p class="item-text">{{ t(item.textKey) }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.agenda-section {
  padding: 56px 20px;
  background: transparent;
}

.agenda-inner {
  width: min(100%, 620px);
  margin: 0 auto;
}

.section-title {
  margin-bottom: 14px;
}

.agenda-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 0 34px;
  text-align: center;

  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(14px, 3.6vw, 17px);
  line-height: 1.9;
  color: var(--ink);
}

/* ---- The programme ---- */
.agenda-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.agenda-item {
  display: grid;
  grid-template-columns: 46px 7px 1fr;
  align-items: start;
  column-gap: 16px;
}

.item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-top: 4px;
  color: var(--gold);
}

.item-icon :deep(.v-icon) {
  font-size: 30px;
}

/* Two hairlines running the height of the row. */
.item-rail {
  position: relative;
  align-self: stretch;
  justify-self: center;
  width: 7px;
  border-left: 1px solid rgba(138, 154, 128, 0.6);
  border-right: 1px solid rgba(138, 154, 128, 0.6);
}

/* The rail starts and ends inside the first and last rows. */
.agenda-item:first-child .item-rail {
  margin-top: 14px;
}

.agenda-item:last-child .item-rail {
  height: 22px;
  align-self: start;
  margin-top: 0;
}

/* A node where each ceremony sits on the rail. */
.item-rail::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  transform: rotate(45deg);
  background: var(--gold);
}

.agenda-item:first-child .item-rail::before {
  top: -6px;
}

.item-body {
  min-width: 0;
  padding-bottom: 26px;
}

.agenda-item:last-child .item-body {
  padding-bottom: 0;
}

.item-time {
  margin: 0;
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-weight: 700;
  font-size: clamp(15px, 4vw, 19px);
  line-height: 1.7;
  color: var(--heading);
}

.item-text {
  margin: 0;
  font-family: "Nunito", "Kantumruy Pro", sans-serif;
  font-size: clamp(14px, 3.6vw, 17px);
  line-height: 1.95;
  color: var(--ink-soft);
}

@media (max-width: 640px) {
  .agenda-section {
    padding: 36px 16px;
  }
  .section-title {
    margin-bottom: 10px;
  }
  .agenda-date {
    margin-bottom: 26px;
  }
  .agenda-item {
    grid-template-columns: 36px 7px 1fr;
    column-gap: 12px;
  }
  .item-icon :deep(.v-icon) {
    font-size: 25px;
  }
  .item-body {
    padding-bottom: 20px;
  }
}

/* ── Desktop and laptop (≥1025px) ─────────────────────────────
   Phone and tablet keep the clamps above. From here up the programme
   widens and its type grows with the viewport.
   ──────────────────────────────────────────────────────────── */
@media only screen and (min-width: 1025px) {
  .agenda-section {
    padding: 84px 32px;
  }

  .agenda-inner {
    width: min(100%, clamp(620px, 54vw, 940px));
  }

  .agenda-date {
    font-size: clamp(17px, 1.2vw, 23px);
    margin-bottom: 46px;
  }

  .agenda-item {
    grid-template-columns: clamp(56px, 4.4vw, 78px) 9px 1fr;
    column-gap: clamp(20px, 1.8vw, 34px);
  }

  .item-icon :deep(.v-icon) {
    font-size: clamp(34px, 2.5vw, 46px);
  }

  .item-time {
    font-size: clamp(19px, 1.45vw, 28px);
  }

  .item-text {
    font-size: clamp(16px, 1.2vw, 23px);
  }

  .item-body {
    padding-bottom: 34px;
  }

  .item-rail::before {
    width: 11px;
    height: 11px;
    margin-left: -5.5px;
  }
}
</style>
