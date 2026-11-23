/* The two celebrations the invitation is for. The main one lives at the site
   root (/ and /<guest id>); the hometown one at /hometown and
   /hometown/<guest id>, with the same guests, page and programme but its own
   date and venue. Texts that differ are in useLang.js (EVENT_MESSAGES).

   Used by the app (useWeddingEvent) and by the .ics file in server/routes;
   Nuxt auto-imports this folder on both sides. */

const TITLE = {
  km: "ពិធីមង្គលការ សុវណ្ណថៃ និង សុហេង",
  en: "Wedding of Sovannthai & Soheng",
};
const DETAILS = {
  km: "សូមគោរពអញ្ជើញចូលរួមពិធីមង្គលការ និងពិសាអាហារពេលល្ងាច វេលាម៉ោង ៥:០០ ល្ងាច។",
  en: "You are warmly invited to our wedding celebration and dinner reception at 5:00 PM.",
};
const LINK_LABEL = {
  km: "លិខិតអញ្ជើញ",
  en: "Invitation",
};

export const WEDDING_EVENTS = {
  main: {
    key: "main",
    // Path prefix of this event's pages: "" for the site root.
    prefix: "",
    // The moment the countdown runs to: 5:00 PM (hero.time) in Cambodia, so
    // guests abroad count down to the same moment.
    date: "2026-12-19T17:00:00+07:00",
    // Short date on the welcome cover.
    dateLabel: "19-December-2026",
    // 17:00–21:00 in Cambodia (UTC+7), written in UTC for calendars.
    start: "20261219T100000Z",
    end: "20261219T140000Z",
    // Opens the Google Maps app on phones, the website on desktop.
    mapUrl: "https://maps.app.goo.gl/3crTcagyMq4ckK9F8",
    title: TITLE,
    details: DETAILS,
    linkLabel: LINK_LABEL,
  },
  hometown: {
    key: "hometown",
    prefix: "/hometown",
    date: "2026-12-12T17:00:00+07:00",
    dateLabel: "12-December-2026",
    start: "20261212T100000Z",
    end: "20261212T140000Z",
    mapUrl: "https://maps.app.goo.gl/R4Sn3UWDtNrzR1Bd9",
    title: TITLE,
    details: DETAILS,
    linkLabel: LINK_LABEL,
  },
};

/* Kept for anything still reading the single event. */
export const WEDDING_EVENT = WEDDING_EVENTS.main;

/* Which event a path belongs to: /hometown… and /share/hometown/… are the
   hometown one, everything else the main one. */
export function weddingEventForPath(path = "") {
  return /^\/(share\/)?hometown(\/|$)/.test(path) ? WEDDING_EVENTS.hometown : WEDDING_EVENTS.main;
}
