import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

/**
 * Vuetify runs on a single dark theme mirroring the Royal Angkor tokens
 * in assets/scss/_variables.scss. Setting the theme here means cards,
 * fields, lists and timelines inherit the palette instead of painting
 * white and being overridden component by component.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'royalAngkor',
      themes: {
        royalAngkor: {
          dark: true,
          colors: {
            background: '#0A1220', // night indigo
            surface: '#152740', // temple blue
            'on-background': '#E8DCCF',
            'on-surface': '#E8DCCF',
            primary: '#D4A843', // leaf gold
            'on-primary': '#0A1220',
            secondary: '#8A6320', // antique gold
            'on-secondary': '#FBEFC0',
            accent: '#FBEFC0',
            error: '#6E1F2A', // lacquer red
            info: '#152740',
            success: '#4F7A5B',
            warning: '#C08A2E',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
