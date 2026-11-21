/* Adds a wish to the guestbook. The browser sends name, message and — from a
   personal link — the guest id; everything else (status, date) is Directus's
   own default, so a visitor can't set it. A wish from a personal link is
   signed with the name on that guest's invitation, not the one sent. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NAME_MAX = 60;
const MESSAGE_MAX = 500;

/* A small brake on one address flooding the guestbook. Kept in memory: the
   site runs as a single Node server, and losing the counts on a restart
   doesn't matter. */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

type Wish = { id: string; name: string; message: string; date_created: string };

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  let name = typeof body?.name === "string" ? body.name.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message || message.length > MESSAGE_MAX || name.length > NAME_MAX) {
    throw createError({ statusCode: 400, statusMessage: "Invalid wish" });
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (tooMany(ip)) {
    throw createError({ statusCode: 429, statusMessage: "Too many wishes" });
  }

  const { directusUrl, directusToken } = useRuntimeConfig(event);
  const directus = { baseURL: directusUrl, headers: { Authorization: `Bearer ${directusToken}` } };

  // Only link the wish to a guest that exists: an unknown id would fail the
  // foreign key and lose the wish with it. A known guest's wish carries the
  // name from their invitation.
  let guest: string | null = null;
  if (typeof body?.guest === "string" && UUID.test(body.guest)) {
    const found = await $fetch<{ data: { id: string; name: string } }>(`/items/guests/${body.guest}`, {
      ...directus,
      query: { fields: "id,name" },
    })
      .then((r) => r.data)
      .catch(() => null);
    if (found) {
      guest = found.id;
      name = found.name.trim().slice(0, NAME_MAX);
    }
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Invalid wish" });
  }

  try {
    const { data } = await $fetch<{ data: Wish }>("/items/wishes", {
      ...directus,
      method: "POST",
      body: { name, message, guest },
      query: { fields: "id,name,message,date_created" },
    });
    setResponseStatus(event, 201);
    return data;
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Could not save wish" });
  }
});
