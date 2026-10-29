/* Looks a guest up in Directus for their personal invitation link. Runs on
   the Nuxt server so the Directus token stays private and the browser only
   ever sees the one guest's id and name — never the guest list. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!UUID.test(id)) {
    throw createError({ statusCode: 404, statusMessage: "Guest not found" });
  }

  const { directusUrl, directusToken } = useRuntimeConfig(event);

  try {
    const { data } = await $fetch<{ data: { id: string; name: string } }>(
      `/items/guests/${id}`,
      {
        baseURL: directusUrl,
        headers: { Authorization: `Bearer ${directusToken}` },
        query: { fields: "id,name" },
      }
    );
    return data;
  } catch (err: any) {
    // Directus answers 403 for an id that doesn't exist, same as a forbidden one
    if (err?.statusCode === 403 || err?.statusCode === 404) {
      throw createError({ statusCode: 404, statusMessage: "Guest not found" });
    }
    throw createError({ statusCode: 502, statusMessage: "Guest lookup failed" });
  }
});
