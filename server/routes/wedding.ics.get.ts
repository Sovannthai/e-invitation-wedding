/* The wedding as an .ics calendar file, behind the "Add to calendar" button:
   it puts the event in the phone's own calendar app, on iPhone and Android
   alike (and Mac or Outlook on a computer).

   ?lang=en|km picks the language (Khmer by default); ?g=<guest id> puts the
   guest's own invitation link in the notes. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* Text values escape \ ; , and newlines (RFC 5545 §3.3.11). */
const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/* Lines are folded at 75 octets, never inside a UTF-8 character: Khmer
   takes three bytes a letter, so counting characters would overrun. */
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = out.length ? 74 : 75; // continuation lines start with a space
    if (bytes + n > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const lang = query.lang === "en" ? "en" : "km";
  const guest = typeof query.g === "string" && UUID.test(query.g) ? query.g : "";

  const origin = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin;
  const invite = guest ? `${origin}/${guest}` : origin;
  const e = WEDDING_EVENT;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sovannthai & Soheng//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-20261219@${new URL(origin).hostname}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${e.start}`,
    `DTEND:${e.end}`,
    `SUMMARY:${esc(e.title[lang])}`,
    `DESCRIPTION:${esc(`${e.details[lang]}\n\n${e.linkLabel[lang]}: ${invite}\n${e.mapUrl}`)}`,
    `LOCATION:${esc(e.mapUrl)}`,
    `URL:${invite}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(e.title[lang])}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  setHeader(event, "Content-Type", "text/calendar; charset=utf-8");
  // Apple devices open an inline calendar file straight into Calendar's
  // "Add to Calendar" sheet. Android can't show one inline, so it gets it as
  // a download, which opens in the phone's calendar app.
  const apple = /iPhone|iPad|iPod|Macintosh/.test(getHeader(event, "user-agent") ?? "");
  const disposition = apple ? "inline" : "attachment";
  setHeader(event, "Content-Disposition", `${disposition}; filename="sovannthai-soheng-wedding.ics"`);
  setHeader(event, "Cache-Control", "no-store");
  return lines.map(fold).join("\r\n") + "\r\n";
});
