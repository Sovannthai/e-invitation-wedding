import { ref } from "vue";

// Shared translation dictionary. Khmer (km) is the default language.
//
// Text wrapped in « » is a placeholder for the couple to fill in — search
// for « to find every one of them. They are left visible on purpose:
// parents' names and the lunar date carry real weight in a Khmer
// invitation, and a plausible-looking wrong value is worse than a gap.
const messages = {
  km: {
    // Hero
    "hero.celebration": "សិរីមង្គលអាពាហ៍ពិពាហ៍",
    "hero.names": "សុវណ្ណថៃ និង សុហេង",
    "hero.warmWelcome": "សូមគោរពអញ្ជើញ",
    "hero.plaqueNames": "សុវណ្ណថៃ និង សុហេង",
    "hero.date": "ថ្ងៃអាទិត្យ ទី២០ ខែធ្នូ ឆ្នាំ២០២៦",
    "hero.dateLunar": "«ថ្ងៃ... កើត/រោច ខែ...» ឆ្នាំម្មី អដ្ឋស័ក ព.ស. ២៥៧០",
    "hero.venue": "ភូមិរំដេង ឃុំអង្គតាសោម ស្រុកត្រាំកក់ ខេត្តតាកែវ",
    "hero.scrollDown": "សូមអូសចុះក្រោម",

    // Families — the parents are the hosts of a Khmer wedding
    "family.eyebrow": "ក្រុមគ្រួសារ",
    "family.title": "អញ្ជើញដោយក្រុមគ្រួសារទាំងសងខាង",
    "family.groomSide": "ខាងកូនប្រុស",
    "family.brideSide": "ខាងកូនស្រី",
    "family.groomFather": "លោក «ឈ្មោះឪពុកខាងកូនប្រុស»",
    "family.groomMother": "លោកស្រី «ឈ្មោះម្តាយខាងកូនប្រុស»",
    "family.brideFather": "លោក «ឈ្មោះឪពុកខាងកូនស្រី»",
    "family.brideMother": "លោកស្រី «ឈ្មោះម្តាយខាងកូនស្រី»",
    "family.invite":
      "មានកិត្តិយសសូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា អញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យសិរីសួស្តី ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស និង កូនស្រី របស់យើងខ្ញុំ។",

    // Countdown
    "countdown.eyebrow": "រាប់ថយក្រោយ",
    "countdown.title": "ថ្ងៃមង្គលការរបស់យើង",
    "countdown.days": "ថ្ងៃ",
    "countdown.hours": "ម៉ោង",
    "countdown.minutes": "នាទី",
    "countdown.seconds": "វិនាទី",

    // Story
    "story.eyebrow": "ដំណើររឿង",
    "story.title": "រឿងស្នេហារបស់យើង",
    "story.firstMeet": "ជួបគ្នាលើកដំបូង",
    "story.firstMeetText": "យើងបានជួបគ្នាលើកដំបូង ហើយបានក្លាយជាមិត្តភក្តិ។",
    "story.fallingInLove": "ធ្លាក់ក្នុងអន្លង់ស្នេហ៍",
    "story.fallingInLoveText": "រឿងស្នេហារបស់យើងបានចាប់ផ្តើមយ៉ាងស្រស់ស្អាត។",
    "story.proposal": "ការសុំដៃ",
    "story.proposalText":
      "គ្រាដ៏មិនអាចបំភ្លេចបាន នៅពេលដែលយើងសម្រេចចិត្តរួមរស់ជាមួយគ្នា។",

    // Programme — the ceremony in the order it actually happens
    "event.eyebrow": "កម្មវិធី",
    "event.title": "កម្មវិធីមង្គលការ",
    "event.date": "ថ្ងៃអាទិត្យ ទី២០ ខែធ្នូ ឆ្នាំ២០២៦",
    "event.haeChumnoun": "ពិធីហែជំនូន",
    "event.haeChumnounText": "ដង្ហែចំណីអាហារ និងជំនូនពីផ្ទះកូនប្រុសមកផ្ទះកូនស្រី។",
    "event.soutMun": "ពិធីសូត្រមន្ត",
    "event.soutMunText": "និមន្តព្រះសង្ឃសូត្រធម៌ ប្រសិទ្ធិពរដល់កូនប្រុស-កូនស្រី។",
    "event.katSak": "ពិធីកាត់សក់",
    "event.katSakText": "ពិធីកាត់សក់បង្គាប់ សម្រាប់ជីវិតថ្មីរបស់គូស្វាមីភរិយា។",
    "event.bangvilPopil": "ពិធីបង្វិលពពិល",
    "event.bangvilPopilText": "ចាស់ទុំបង្វិលពពិលជុំវិញគូស្វាមីភរិយា ដើម្បីប្រសិទ្ធិពរ។",
    "event.reception": "ពិធីជប់លៀង",
    "event.receptionText": "សូមអញ្ជើញរួមតុភោជនាហារ និងអបអរជាមួយយើងខ្ញុំ។",
    // Times are provisional — confirm with the families before sending.
    "event.timeHae": "០៧:០០ ព្រឹក",
    "event.timeSout": "០៨:៣០ ព្រឹក",
    "event.timeKat": "០៩:៣០ ព្រឹក",
    "event.timePopil": "១០:៣០ ព្រឹក",
    "event.timeReception": "០៥:០០ ល្ងាច",
    "event.addToCalendar": "បញ្ចូលទៅប្រតិទិន",
    "event.google": "Google Calendar",
    "event.ics": "Apple / Outlook (.ics)",

    // Gallery / Location
    "gallery.eyebrow": "រូបភាព",
    "gallery.title": "កម្រងរូបភាព",
    "location.eyebrow": "ទីតាំង",
    "location.title": "ទីកន្លែងប្រារព្ធពិធី",
    "location.openMap": "បើកក្នុងផែនទី",

    // RSVP
    "rsvp.eyebrow": "ការចូលរួម",
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

    // Gift
    "payment.eyebrow": "អំណោយ",
    "payment.title": "អំណោយមង្គលការ",
    "payment.text":
      "វត្តមានរបស់លោកអ្នកគឺជាអំណោយដ៏មានតម្លៃបំផុត។ ប្រសិនបើលោកអ្នកមានបំណងជូនអំណោយ សូមស្កេន QR កូដខាងក្រោម។",
    "payment.account": "សុវណ្ណថៃ និង សុហេង",
    "payment.khqr": "ការទូទាត់តាម KHQR",
    "payment.thanks": "សូមអរគុណសម្រាប់សេចក្តីស្រឡាញ់ និងការគាំទ្ររបស់លោកអ្នក",

    // Nav
    "nav.home": "ទំព័រដើម",
    "nav.family": "ក្រុមគ្រួសារ",
    "nav.music": "បើក/បិទ ភ្លេង",

    // Language switch
    "lang.switch": "EN",
  },

  en: {
    // Hero
    "hero.celebration": "Celebration of Marriage",
    "hero.names": "Sovannthai & Soheng",
    "hero.warmWelcome": "You are warmly invited",
    "hero.plaqueNames": "Sovannthai & Soheng",
    "hero.date": "Sunday, 20 December 2026",
    "hero.dateLunar": "«… waxing/waning, month …» Year of the Horse, BE 2570",
    "hero.venue": "Rumdeng Village, Angk Ta Saom, Tram Kak, Takeo",
    "hero.scrollDown": "Scroll down",

    // Families
    "family.eyebrow": "The families",
    "family.title": "With the blessing of both families",
    "family.groomSide": "Parents of the groom",
    "family.brideSide": "Parents of the bride",
    "family.groomFather": "Mr. «groom's father»",
    "family.groomMother": "Mrs. «groom's mother»",
    "family.brideFather": "Mr. «bride's father»",
    "family.brideMother": "Mrs. «bride's mother»",
    "family.invite":
      "request the honour of your presence at the wedding of our son and daughter, and ask that you join us to give them your blessing.",

    // Countdown
    "countdown.eyebrow": "Counting down",
    "countdown.title": "Our Wedding Day",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    // Story
    "story.eyebrow": "How it began",
    "story.title": "Our Love Story",
    "story.firstMeet": "First Meet",
    "story.firstMeetText": "We met for the first time and became friends.",
    "story.fallingInLove": "Falling In Love",
    "story.fallingInLoveText": "Our love story began beautifully.",
    "story.proposal": "Proposal",
    "story.proposalText":
      "The unforgettable moment when we decided to spend our lives together.",

    // Programme
    "event.eyebrow": "The day",
    "event.title": "Wedding Programme",
    "event.date": "Sunday, 20 December 2026",
    "event.haeChumnoun": "Hae Chumnoun",
    "event.haeChumnounText":
      "The groom's family processes to the bride's home bearing gifts and offerings.",
    "event.soutMun": "Sout Mun",
    "event.soutMunText": "Monks chant and give their blessing to the couple.",
    "event.katSak": "Kat Sak",
    "event.katSakText":
      "The symbolic hair-cutting that prepares the couple for their new life.",
    "event.bangvilPopil": "Bangvil Popil",
    "event.bangvilPopilText":
      "Elders pass the candle-bearing popil in circles around the couple to bless them.",
    "event.reception": "Reception",
    "event.receptionText": "Please join us for dinner and celebration.",
    "event.timeHae": "07:00 AM",
    "event.timeSout": "08:30 AM",
    "event.timeKat": "09:30 AM",
    "event.timePopil": "10:30 AM",
    "event.timeReception": "05:00 PM",
    "event.addToCalendar": "Add to Calendar",
    "event.google": "Google Calendar",
    "event.ics": "Apple / Outlook (.ics)",

    // Gallery / Location
    "gallery.eyebrow": "Photographs",
    "gallery.title": "Gallery",
    "location.eyebrow": "Where",
    "location.title": "Getting There",
    "location.openMap": "Open in Maps",

    // RSVP
    "rsvp.eyebrow": "Attendance",
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

    // Gift
    "payment.eyebrow": "Gifts",
    "payment.title": "Wedding Gift",
    "payment.text":
      "Your presence is the greatest gift. If you wish to bless us with a gift, you can scan the QR code below.",
    "payment.account": "Sovannthai & Soheng",
    "payment.khqr": "KHQR Payment",
    "payment.thanks": "Thank you for your love and support",

    // Nav
    "nav.home": "Home",
    "nav.family": "Families",
    "nav.music": "Play / pause music",

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
