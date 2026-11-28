/* Link previews: the photo card Telegram, Messenger, Facebook and others show
   under an invitation link when it is pasted into a chat.

   Those apps read <meta property="og:…"> tags from the HTML and never run
   JavaScript, and this site renders in the browser (ssr: false), so useHead
   in a page would never reach them. Instead the tags are written into the
   HTML on the server, for every page, here.

   og:image must be a full https:// URL, so it is built from the address the
   request came in on (behind Caddy: X-Forwarded-Host / -Proto), or from
   NUXT_SITE_URL when that is set. On a guest's personal link the title
   greets them by name. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Bump when public/og-image.jpg changes: Telegram and Facebook cache the
// image by its URL, so a new query string makes them fetch it again.
const IMAGE = "/og-image.jpg?v=1";

const DATE = {
  main: { km: "ថ្ងៃសៅរ៍ ទី១៩ ខែធ្នូ ឆ្នាំ២០២៦", en: "Saturday, 19 December 2026" },
  hometown: { km: "ថ្ងៃសៅរ៍ ទី១២ ខែធ្នូ ឆ្នាំ២០២៦", en: "Saturday, 12 December 2026" },
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* The guest's name for /<id> or /hometown/<id>, or "" when the path is not a
   guest link or the lookup fails or is slow: the preview then just goes
   without the name rather than holding the page up. */
async function guestName(event: any, path: string): Promise<string> {
  const id = path.replace(/^\/hometown/, "").replace(/^\//, "");
  if (!UUID.test(id)) return "";
  const { directusUrl, directusToken } = useRuntimeConfig(event);
  try {
    const { data } = await $fetch<{ data: { name: string } }>(`/items/guests/${id}`, {
      baseURL: directusUrl,
      headers: { Authorization: `Bearer ${directusToken}` },
      query: { fields: "name" },
      timeout: 2000,
    });
    return data?.name?.trim() ?? "";
  } catch {
    return "";
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", async (html, { event }) => {
    const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // The couple's own copy-the-text page is not for sharing.
    if (path.startsWith("/share")) return;

    const { siteUrl } = useRuntimeConfig(event);
    const origin = (siteUrl || url.origin).replace(/\/+$/, "");
    const date = DATE[path.startsWith("/hometown") ? "hometown" : "main"];
    const name = await guestName(event, path);

    const title = name
      ? `សូមគោរពអញ្ជើញ ${name} · Wedding of Sovannthai & Soheng`
      : "ពិធីមង្គលការ សុវណ្ណថៃ និង សុហេង · Wedding of Sovannthai & Soheng";
    const description = `${date.km} · ម៉ោង ៥:០០ ល្ងាច\n${date.en} · 5:00 PM`;
    const image = `${origin}${IMAGE}`;

    const tags: [string, string, string][] = [
      ["property", "og:type", "website"],
      ["property", "og:site_name", "Sovannthai & Soheng Wedding"],
      ["property", "og:url", `${origin}${path === "/" ? "" : path}`],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:image", image],
      ["property", "og:image:type", "image/jpeg"],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:image:alt", "Sovannthai and Soheng at Angkor Wat"],
      ["name", "description", description],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", image],
    ];

    html.head.push(
      tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escape(value)}">`).join("\n"),
    );
  });
});
