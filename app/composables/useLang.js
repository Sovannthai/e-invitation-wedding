import { ref } from "vue";

// Shared translation dictionary. Khmer (km) is the default language.
const messages = {
  km: {
    // Hero
    "hero.celebration": "សិរីមង្គលអាពាហ៍ពិពាហ៍",
    "hero.names": "សុវណ្ណថៃ និង សុហេង",
    "hero.warmWelcome": "សូមគោរពអញ្ជើញ",
    "hero.plaqueNames": "សុវណ្ណថៃ និង សុហេង",
    // "hero.date": "១៩ ធ្នូ ២០២៦",
    "hero.date": "ថ្ងៃអាទិត្យ ទី១៩ ខែធ្នូរ ឆ្នាំ២០២៦ វេលាម៉ោង ៤៖០០ ល្ងាច ទីតាំង ភូមិរំដេង ឃុំអង្គតាសោម ស្រុកត្រាំកក់ ខេត្តតាកែវ",
    "hero.scrollDown": "សូមអូសចុះក្រោម",

    // Countdown
    "countdown.title": "ថ្ងៃមង្គលការរបស់យើង",
    "countdown.days": "ថ្ងៃ",
    "countdown.hours": "ម៉ោង",
    "countdown.minutes": "នាទី",
    "countdown.seconds": "វិនាទី",

    // Story
    "story.title": "រឿងស្នេហារបស់យើង",
    "story.firstMeet": "ជួបគ្នាលើកដំបូង",
    "story.firstMeetText": "យើងបានជួបគ្នាលើកដំបូង ហើយបានក្លាយជាមិត្តភក្តិ។",
    "story.fallingInLove": "ធ្លាក់ក្នុងអន្លង់ស្នេហ៍",
    "story.fallingInLoveText": "រឿងស្នេហារបស់យើងបានចាប់ផ្តើមយ៉ាងស្រស់ស្អាត។",
    "story.proposal": "ការសុំដៃ",
    "story.proposalText":
      "គ្រាដ៏មិនអាចបំភ្លេចបាន នៅពេលដែលយើងសម្រេចចិត្តរួមរស់ជាមួយគ្នា។",

    // Event
    "event.title": "កម្មវិធីមង្គលការ",
    "event.ceremony": "ពិធីមង្គល",
    "event.reception": "ពិធីជប់លៀង",
    "event.date": "២០ ធ្នូ ២០២៦",
    "event.timeMorning": "ម៉ោង ០៩:០០ ព្រឹក",
    "event.timeEvening": "ម៉ោង ០៦:០០ ល្ងាច",
    "event.location": "ភ្នំពេញ",
    "event.addToCalendar": "បញ្ចូលទៅប្រតិទិន",
    "event.google": "Google Calendar",
    "event.ics": "Apple / Outlook (.ics)",

    // Gallery / Location
    "gallery.title": "វិចិត្រសាល",
    "location.title": "ទីតាំង",

    // RSVP
    "rsvp.title": "បញ្ជាក់ការចូលរួម",
    "rsvp.confirm": "សូមបញ្ជាក់ការចូលរួមរបស់អ្នក",
    "rsvp.name": "ឈ្មោះរបស់អ្នក",
    "rsvp.phone": "លេខទូរស័ព្ទ",
    "rsvp.willAttend": "តើអ្នកនឹងចូលរួមទេ?",
    "rsvp.attending": "ចូលរួម",
    "rsvp.notAttending": "មិនចូលរួម",
    "rsvp.message": "សារ",
    "rsvp.send": "ផ្ញើការបញ្ជាក់",
    "rsvp.thanks": "សូមអរគុណសម្រាប់ការឆ្លើយតបរបស់អ្នក!",

    // Payment
    "payment.title": "អំណោយមង្គលការ",
    "payment.text":
      "វត្តមានរបស់លោកអ្នកគឺជាអំណោយដ៏មានតម្លៃបំផុត។ ប្រសិនបើលោកអ្នកមានបំណងជូនអំណោយ សូមស្កេន QR កូដខាងក្រោម។",
    "payment.account": "សុវណ្ណថៃ និង សុហេង",
    "payment.khqr": "ការទូទាត់តាម KHQR",
    "payment.thanks": "សូមអរគុណសម្រាប់សេចក្តីស្រឡាញ់ និងការគាំទ្ររបស់លោកអ្នក ❤️",

    // Nav
    "nav.home": "ទំព័រដើម",

    // Language switch
    "lang.switch": "EN",
  },

  en: {
    // Hero
    "hero.celebration": "Celebration of Marriage",
    "hero.names": "Sovannthai & Soheng",
    "hero.warmWelcome": "Warm Welcome",
    "hero.plaqueNames": "Sovannthai & Soheng",
    "hero.date": "19 December 2026",
    "hero.scrollDown": "Scroll down",

    // Countdown
    "countdown.title": "Our Wedding Day",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    // Story
    "story.title": "Our Love Story",
    "story.firstMeet": "First Meet",
    "story.firstMeetText": "We met for the first time and became friends.",
    "story.fallingInLove": "Falling In Love",
    "story.fallingInLoveText": "Our love story began beautifully.",
    "story.proposal": "Proposal",
    "story.proposalText":
      "The unforgettable moment when we decided to spend our lives together.",

    // Event
    "event.title": "Wedding Event",
    "event.ceremony": "Ceremony",
    "event.reception": "Reception",
    "event.date": "20 December 2026",
    "event.timeMorning": "09:00 AM",
    "event.timeEvening": "06:00 PM",
    "event.location": "Phnom Penh",
    "event.addToCalendar": "Add to Calendar",
    "event.google": "Google Calendar",
    "event.ics": "Apple / Outlook (.ics)",

    // Gallery / Location
    "gallery.title": "Gallery",
    "location.title": "Location",

    // RSVP
    "rsvp.title": "RSVP",
    "rsvp.confirm": "Confirm Your Attendance",
    "rsvp.name": "Your Name",
    "rsvp.phone": "Phone Number",
    "rsvp.willAttend": "Will you attend?",
    "rsvp.attending": "Attending",
    "rsvp.notAttending": "Not Attending",
    "rsvp.message": "Message",
    "rsvp.send": "Send RSVP",
    "rsvp.thanks": "Thank you for your response!",

    // Payment
    "payment.title": "Wedding Gift",
    "payment.text":
      "Your presence is the greatest gift. If you wish to bless us with a gift, you can scan the QR code below.",
    "payment.account": "Sovannthai & Partner",
    "payment.khqr": "KHQR Payment",
    "payment.thanks": "Thank you for your love and support ❤️",

    // Nav
    "nav.home": "Home",

    // Language switch
    "lang.switch": "ខ្មែរ",
  },
};

// Default language is Khmer. Persist the user's choice on the client.
const locale = ref("km");
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("locale");
  if (saved === "km" || saved === "en") locale.value = saved;
}

export function useLang() {
  function setLocale(l) {
    locale.value = l;
    if (typeof window !== "undefined") localStorage.setItem("locale", l);
  }

  function toggle() {
    setLocale(locale.value === "km" ? "en" : "km");
  }

  function t(key) {
    return messages[locale.value]?.[key] ?? messages.en[key] ?? key;
  }

  return { locale, t, setLocale, toggle };
}
