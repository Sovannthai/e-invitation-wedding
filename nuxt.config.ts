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
        // Latin and Khmer are paired per role, Latin first in every stack so
        // English renders in the Latin face and Khmer falls through to Moul
        // or Kantumruy Pro behind it.
        //   Playfair Display — English headings (bold serif caps)
        //   Nunito          — English body
        //   Moul            — Khmer headings
        //   Kantumruy Pro   — Khmer body
        //   Cormorant / Parisienne — the envelope only
        families: {
          "Playfair+Display": [400, 500, 600, 700],
          "Nunito": [300, 400, 600, 700],
          "Cormorant+Garamond": [400, 500, 600, 700],
          "Parisienne": [400],
          "Moul": [400],
          // Khmer calligraphic hand, used only for the envelope monogram
          "Fasthand": [400],
          "Kantumruy+Pro": [400, 500, 600, 700],
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
       title: "Sovannthai&Soheng Wedding Invitation",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css",
        },
      ],
      script: [
        {
          type: "module",
          src: "https://unpkg.com/@splinetool/viewer@1.12.42/build/spline-viewer.js",
        },
      ],
    },
  },
})
