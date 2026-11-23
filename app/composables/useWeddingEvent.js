import { computed } from "vue";

/* The celebration the current page invites to, from its path: the hometown
   one under /hometown, the main one everywhere else. See
   shared/utils/weddingEvent.js. */
export function useWeddingEvent() {
  const route = useRoute();
  return computed(() => weddingEventForPath(route.path));
}
