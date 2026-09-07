<script setup>
const { t } = useLang();

/**
 * The day, in the order it actually happens. A Khmer wedding is a sequence
 * of named ceremonies, so the timeline device here is carrying real
 * information — the order and the hour — not decorating the section.
 *
 * PROVISIONAL: the hours below and in `eventInfo` are placeholders based on
 * a conventional running order. Confirm them with both families, then edit
 * the `event.time*` entries in composables/useLang.js.
 */
const programme = [
  { timeKey: "event.timeHae", titleKey: "event.haeChumnoun", textKey: "event.haeChumnounText" },
  { timeKey: "event.timeSout", titleKey: "event.soutMun", textKey: "event.soutMunText" },
  { timeKey: "event.timeKat", titleKey: "event.katSak", textKey: "event.katSakText" },
  { timeKey: "event.timePopil", titleKey: "event.bangvilPopil", textKey: "event.bangvilPopilText" },
  { timeKey: "event.timeReception", titleKey: "event.reception", textKey: "event.receptionText" },
];

// Wedding event details (local Cambodia time), covering procession → reception.
const eventInfo = {
  title: "Sovannthai & Soheng — Wedding",
  location: "Rumdeng Village, Angk Ta Saom, Tram Kak, Takeo, Cambodia",
  description: "Join us to celebrate the wedding of Sovannthai & Soheng.",
  start: "20261220T070000", // 20 Dec 2026, 07:00 — Hae Chumnoun
  end: "20261220T220000", // 20 Dec 2026, 22:00 — end of reception
  tz: "Asia/Phnom_Penh",
};

function addToGoogle() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventInfo.title,
    dates: `${eventInfo.start}/${eventInfo.end}`,
    details: eventInfo.description,
    location: eventInfo.location,
    ctz: eventInfo.tz,
  });
  window.open(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    "_blank"
  );
}

function downloadIcs() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//e-invitation-wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@sovannthai-soheng-wedding`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${eventInfo.start}`,
    `DTEND:${eventInfo.end}`,
    `SUMMARY:${eventInfo.title}`,
    `LOCATION:${eventInfo.location}`,
    `DESCRIPTION:${eventInfo.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sovannthai-soheng-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <section id="event" class="event-section">
    <div class="event-inner">
      <p class="k-eyebrow" data-aos="fade-up">{{ t("event.eyebrow") }}</p>
      <h2 class="section-title" data-aos="fade-up" data-aos-delay="60">
        {{ t("event.title") }}
      </h2>
      <p class="event-date" data-aos="fade-up" data-aos-delay="90">
        {{ t("event.date") }}
      </p>

      <ol class="programme">
        <li
          v-for="(step, i) in programme"
          :key="step.titleKey"
          class="step"
          data-aos="fade-up"
          :data-aos-delay="60 + i * 70"
        >
          <time class="step-time">{{ t(step.timeKey) }}</time>

          <span class="step-marker" aria-hidden="true"></span>

          <div class="step-body">
            <h3 class="step-title">{{ t(step.titleKey) }}</h3>
            <p class="step-text">{{ t(step.textKey) }}</p>
          </div>
        </li>
      </ol>

      <div class="cal-wrap" data-aos="fade-up">
        <v-menu location="bottom center">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="outlined"
              size="large"
              class="cal-btn"
              prepend-icon="mdi-calendar-plus"
            >
              {{ t("event.addToCalendar") }}
            </v-btn>
          </template>

          <v-list class="cal-list" density="comfortable">
            <v-list-item prepend-icon="mdi-google" @click="addToGoogle">
              <v-list-item-title>{{ t("event.google") }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-calendar-export" @click="downloadIcs">
              <v-list-item-title>{{ t("event.ics") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-section {
  padding: 64px 20px;
  background: transparent;
}

.event-inner {
  width: min(100%, var(--k-measure));
  margin: 0 auto;
  text-align: center;
}

.section-title {
  margin: 6px 0 4px;
}

.event-date {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(13px, 3.4vw, 16px);
  letter-spacing: 0.08em;
  color: rgba(212, 168, 67, 0.78);
  line-height: 1.9;
  margin: 0 0 34px;
}

/* ---- The running order ---- */
.programme {
  list-style: none;
  margin: 0 0 34px;
  padding: 0;
  text-align: left;
}

.step {
  display: grid;
  grid-template-columns: 5.5rem 13px 1fr;
  align-items: start;
  column-gap: 14px;
}

.step-time {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(12px, 3.2vw, 14px);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
  color: rgba(212, 168, 67, 0.85);
  line-height: 2.4;
  text-align: right;
  white-space: nowrap;
}

/* The rule runs through the markers, joining the ceremonies into one day. */
.step-marker {
  position: relative;
  align-self: stretch;
  justify-self: center;
  width: 1px;
  background: rgba(212, 168, 67, 0.3);
}

.step:first-child .step-marker {
  background: linear-gradient(180deg, rgba(212, 168, 67, 0) 0%, rgba(212, 168, 67, 0.3) 22px);
}

.step:last-child .step-marker {
  background: linear-gradient(180deg, rgba(212, 168, 67, 0.3) 0%, rgba(212, 168, 67, 0) 100%);
}

/* A small lotus-bud diamond where each ceremony sits on the rule. */
.step-marker::before {
  content: "";
  position: absolute;
  top: 16px;
  left: 50%;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  transform: rotate(45deg);
  background: var(--k-gold);
  box-shadow: 0 0 10px rgba(212, 168, 67, 0.6);
}

.step-body {
  padding: 6px 0 26px;
  min-width: 0;
}

.step:last-child .step-body {
  padding-bottom: 4px;
}

.step-title {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 500;
  font-size: clamp(15px, 3.9vw, 19px);
  line-height: 1.9;
  margin: 0 0 2px;

  background: var(--k-foil);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.step-text {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(13px, 3.4vw, 16px);
  line-height: 2;
  color: rgba(232, 220, 207, 0.75);
  margin: 0;
}

/* ---- Add to calendar ---- */
.cal-wrap {
  display: flex;
  justify-content: center;
}

.cal-btn {
  color: var(--k-gold) !important;
  border-color: rgba(212, 168, 67, 0.55) !important;
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: none;
  border-radius: 3px;
}

.cal-btn:hover {
  background: rgba(212, 168, 67, 0.12) !important;
}

@media (max-width: 640px) {
  .event-section {
    padding: 44px 18px;
  }
  .event-date {
    margin-bottom: 26px;
  }
  .step {
    grid-template-columns: 4.4rem 13px 1fr;
    column-gap: 10px;
  }
}
</style>
