/* The guestbook: published wishes, newest first. Runs on the Nuxt server so
   the Directus token stays private; the browser only gets what is listed in
   `fields` — never which guest's link a wish was sent from. */
type Wish = { id: string; name: string; message: string; date_created: string };

export default defineEventHandler(async (event) => {
  const { directusUrl, directusToken } = useRuntimeConfig(event);

  try {
    const { data } = await $fetch<{ data: Wish[] }>("/items/wishes", {
      baseURL: directusUrl,
      headers: { Authorization: `Bearer ${directusToken}` },
      query: {
        fields: "id,name,message,date_created",
        "filter[status][_eq]": "published",
        sort: "-date_created",
        limit: 200,
      },
    });
    return data;
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Could not load wishes" });
  }
});
