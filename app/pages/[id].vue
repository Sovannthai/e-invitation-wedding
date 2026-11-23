<template>
  <Invitation :guest="guest?.name ?? ''"/>
</template>

<script setup>
/* A guest's personal link: /<guest id> from Directus. An unknown or
   mistyped id still gets the invitation, just addressed to an honoured
   guest rather than by name. */
/* Also /hometown/<guest id>: the same invitation for the hometown
   celebration (its own date and venue, see useWeddingEvent). */
definePageMeta({ alias: "/hometown/:id" });

const route = useRoute();

const { data: guest } = await useFetch(`/api/guests/${route.params.id}`, {
  key: `guest-${route.params.id}`,
});
</script>
