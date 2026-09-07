import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    [
      "@nuxtjs/google-fonts",
      {
        // Three families, one per role. Latin display and body are both
        // Cormorant Garamond; Moul carries Khmer headings, Kantumruy Pro
        // Khmer prose. Everything else was dropped as unused weight.
        families: {
          "Cormorant+Garamond": [300, 400, 500, 600],
          "Moul": [400],
          "Kantumruy+Pro": [300, 400, 500, 600],
        },
        display: "swap",
      },
    ],
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_global.scss" as *;',
        },
      },
    },
  },
  css: ["@mdi/font/css/materialdesignicons.css", 'vuetify/styles', '~/assets/main.scss'],
  app: {
    head: {
      title: "សិរីមង្គលអាពាហ៍ពិពាហ៍ · Sovannthai & Soheng",
      htmlAttrs: { lang: "km" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0A1220" },
        {
          name: "description",
          content:
            "សូមគោរពអញ្ជើញចូលរួមក្នុងពិធីមង្គលការ សុវណ្ណថៃ និង សុហេង · 20 December 2026, Takeo.",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css",
        },
      ],
    },
  },
})
