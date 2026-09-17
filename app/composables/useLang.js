import { ref, watch } from "vue";

// Shared translation dictionary. Khmer (km) is the default language.
const messages = {
  km: {
    // Envelope
    "envelope.title": "សិរីមង្គលអាពាហ៍ពិពាហ៍",
    "envelope.invite": "សូមគោរពអញ្ជើញ",
    "envelope.guest": "ភ្ញៀវកិត្តិយស",
    "envelope.hint": "សូមប៉ះលើត្រា",

    // Hero
    "hero.celebration": "សិរីមង្គលអាពាហ៍ពិពាហ៍",

    "hero.groomLabel": "កូនប្រុសនាម",
    "hero.groomName": "នាង សុវណ្ណថៃ",
    "hero.brideLabel": "កូនស្រីនាម",
    "hero.brideName": "ឈុំ សុហេង",

    "hero.honour": "មានកិត្តិយសសូមគោរពអញ្ជើញ",
    "hero.inviteBody":
      "ឯកឧត្តម អ្នកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និង ប្រិយមិត្តអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យសិរីសួស្តី ជ័យមង្គល ក្នុងពិធីអាពាហ៍ពិពាហ៍ របស់យើងខ្ញុំទាំងពីរ។",

    "hero.month": "ខែធ្នូ",
    "hero.weekday": "ថ្ងៃសៅរ៍",
    "hero.day": "១៩",
    "hero.time": "ម៉ោង ៥ ល្ងាច",
    "hero.year": "២០២៦",

    "hero.scrollDown": "សូមអូសចុះក្រោម",

    // Countdown
    "countdown.title": "ថ្ងៃមង្គលការរបស់យើង",
    "countdown.days": "ថ្ងៃ",
    "countdown.hours": "ម៉ោង",
    "countdown.minutes": "នាទី",
    "countdown.seconds": "វិនាទី",

    // Story
    "agenda.title": "របៀបវារះកម្មវិធី",
    // The lunar day and month still need to be filled in; the animal year,
    // sak and Buddhist era below are correct for December 2026.
    "agenda.dateLunar": "ថ្ងៃសៅរ៏ «១០កើត ខែមិគសិរ» ឆ្នាំមមី អដ្ឋស័ក",
    "agenda.dateGregorian": "ព.ស. ២៥៧០ ត្រូវនឹងថ្ងៃទី១៩ ខែធ្នូ ឆ្នាំ២០២៦",

    "agenda.t1": "ម៉ោង ០៦:៣០ ព្រឹក",
    "agenda.d1": "ពិធីហែជំនូន(កំណត់) ចូលរោងជ័យ",
    "agenda.t2": "ម៉ោង ០៨:០០ ព្រឹក",
    "agenda.d2": "ពិធីនិយាយដណ្តឹងការ និងរាប់ផ្លែឈើ",
    "agenda.t3": "ម៉ោង ០៨:៣០ ព្រឹក",
    "agenda.d3": "ពិធីបំពាក់ចិញ្ចៀន",
    "agenda.t4": "ម៉ោង ០៩:០០ ព្រឹក",
    "agenda.d4": "ពិធីកាត់សក់បង្កក់សិរី និងចម្រើនកេសា",
    "agenda.t5": "ម៉ោង ១០:០០ ព្រឹក",
    "agenda.d5": "ពិធីសំពះផ្ទឹម បង្វិលពពិល ពិធីចងដៃ បាចផ្កាស្លា និងព្រះថោងកាន់ស្បៃ",
    "agenda.t6": "ម៉ោង ១២:០០ ថ្ងៃត្រង់",
    "agenda.d6": "អញ្ជើញភ្ញៀវកិត្តិយស ពិសាអាហារថ្ងៃត្រង់",
    "agenda.t7": "ម៉ោង ០៥:០០ ល្ងាច",
    "agenda.d7": "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយស ពិសាអាហារពេលល្ងាច",

    // Gallery / Location
    "gallery.title": "កម្រងរូបភាព",
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
    // The control names what pressing it will do, not its current state.
    "nav.musicPlay": "បើកភ្លេង",
    "nav.musicPause": "បិទភ្លេង",

    // Language switch
    "lang.switch": "EN",
  },

  en: {
    // Envelope
    "envelope.title": "Celebration of Marriage",
    "envelope.invite": "You are cordially invited",
    "envelope.guest": "Our Honoured Guest",
    "envelope.hint": "Tap the seal",

    // Hero
    "hero.celebration": "Celebration of Marriage",

    "hero.groomLabel": "The Groom",
    "hero.groomName": "Neang Sovannthai",
    "hero.brideLabel": "The Bride",
    "hero.brideName": "Chhum Soheng",

    "hero.honour": "Request the honour of your presence",
    "hero.inviteBody":
      "Excellencies, Oknha, Lok Chumteav, Ladies and Gentlemen, and dear friends — we respectfully invite you to preside over and to join us as honoured guests, to bestow your blessings and good fortune upon our wedding.",

    "hero.month": "December",
    "hero.weekday": "Saturday",
    "hero.day": "19",
    "hero.time": "5:00 PM",
    "hero.year": "2026",

    "hero.scrollDown": "Scroll down",

    // Countdown
    "countdown.title": "Event Countdown",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    // Story
    "agenda.title": "Wedding Programme",
    "agenda.dateLunar": "Saturday, 10th waxing day of Migasira, Year of the Horse, Atthasak",
    "agenda.dateGregorian": "BE 2570, corresponding to 19 December 2026",

    "agenda.t1": "06:30 AM",
    "agenda.d1": "The Hae Chumnoun procession, bearing the appointed gifts, enters the wedding pavilion",
    "agenda.t2": "08:00 AM",
    "agenda.d2": "The betrothal address and the counting of the fruit offerings",
    "agenda.t3": "08:30 AM",
    "agenda.d3": "The exchange of rings",
    "agenda.t4": "09:00 AM",
    "agenda.d4": "Kat Sak — the blessing hair-cutting and grooming",
    "agenda.t5": "10:00 AM",
    "agenda.d5": "Sompeas Ptem, Bangvil Popil, the tying of the blessing threads, the scattering of sla blossom, and Preah Thong holding the scarf",
    "agenda.t6": "12:00 Noon",
    "agenda.d6": "Guests are invited to lunch",
    "agenda.t7": "05:00 PM",
    "agenda.d7": "Reception of our guests, followed by dinner",

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
    "payment.account": "THAI & HENG",
    "payment.khqr": "KHQR Payment",
    "payment.thanks": "Thank you for your love and support ❤️",

    // Nav
    "nav.home": "Home",
    "nav.musicPlay": "Play music",
    "nav.musicPause": "Pause music",

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

// Mirror the locale onto <html> so CSS can treat the two scripts
// differently — English headings take caps and tracking, Khmer must not.
if (typeof document !== "undefined") {
  const syncDocumentLocale = (l) => {
    document.documentElement.dataset.locale = l;
    document.documentElement.lang = l;
  };
  syncDocumentLocale(locale.value);
  watch(locale, syncDocumentLocale);
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
