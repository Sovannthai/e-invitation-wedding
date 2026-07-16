<script setup>
const { t } = useLang();

// Wedding event details (local Cambodia time). Covers ceremony -> reception.
const eventInfo = {
  title: "Sovannthai & Soheng — Wedding",
  location: "Phnom Penh, Cambodia",
  description: "Join us to celebrate the wedding of Sovannthai & Soheng.",
  start: "20261220T090000", // 20 Dec 2026, 09:00
  end: "20261220T220000", // 20 Dec 2026, 22:00
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
    <v-container class="text-center">
      <h2 class="section-title" data-aos="fade-up">{{ t("event.title") }}</h2>

      <v-row justify="center" class="mt-10">
        <v-col cols="12" md="4">
          <v-card class="event-card" data-aos="fade-up" data-aos-delay="0">
            <v-card-title class="gold">{{ t("event.ceremony") }}</v-card-title>

            <v-card-text>
              <p>{{ t("event.date") }}</p>

              <p>{{ t("event.timeMorning") }}</p>

              <p>{{ t("event.location") }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="event-card" data-aos="fade-up" data-aos-delay="150">
            <v-card-title class="gold">{{ t("event.reception") }}</v-card-title>

            <v-card-text>
              <p>{{ t("event.date") }}</p>

              <p>{{ t("event.timeEvening") }}</p>

              <p>{{ t("event.location") }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="mt-10" data-aos="fade-up" data-aos-delay="200">
        <v-menu location="bottom center">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="large"
              rounded="lg"
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
    </v-container>
  </section>
</template>

<style scoped>
.event-section {
  padding: 56px 20px;

  /* No own background – shows the single site background */
  background: transparent;
}

.section-title {
  font-size: clamp(28px, 6vw, 42px);
}

@media (max-width: 640px) {
  .event-section {
    padding: 36px 16px;
  }
}

.event-card {
  padding: 30px;

  border-radius: 24px;

  /* Frosted glass instead of solid white */
  background: rgba(255, 255, 255, 0.38) !important;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  border: 1px solid rgba(255, 255, 255, 0.45);

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);

  transition: 0.3s;
}

.event-card:hover {
  transform: translateY(-8px);
}

.gold {
  color: #c8a96a;

  font-weight: 600;
}

/* Add-to-calendar button */
.cal-btn {
  color: #fff !important;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: linear-gradient(180deg, #e6c25c, #c8971f) !important;
  box-shadow: 0 10px 24px rgba(200, 151, 31, 0.4);
}
</style>
