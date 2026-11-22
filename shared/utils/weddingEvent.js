/* The wedding as a calendar event: the evening reception the invitation asks
   guests to (5:00 PM on Saturday 19 December 2026, Cambodia time). Used by the
   .ics file in server/routes (auto-imported by Nuxt). */

export const WEDDING_EVENT = {
  // 17:00–21:00 in Cambodia (UTC+7), written in UTC for calendars.
  start: "20261219T100000Z",
  end: "20261219T140000Z",
  mapUrl: "https://maps.app.goo.gl/3crTcagyMq4ckK9F8",
  title: {
    km: "ពិធីមង្គលការ សុវណ្ណថៃ និង សុហេង",
    en: "Wedding of Sovannthai & Soheng",
  },
  details: {
    km: "សូមគោរពអញ្ជើញចូលរួមពិធីមង្គលការ និងពិសាអាហារពេលល្ងាច វេលាម៉ោង ៥:០០ ល្ងាច។",
    en: "You are warmly invited to our wedding celebration and dinner reception at 5:00 PM.",
  },
  linkLabel: {
    km: "លិខិតអញ្ជើញ",
    en: "Invitation",
  },
};
