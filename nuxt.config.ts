import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  // Server-only: read by server/api, never shipped to the browser. Set them
  // with NUXT_DIRECTUS_URL / NUXT_DIRECTUS_TOKEN (see .env.example).
  runtimeConfig: {
    directusUrl: "http://localhost:8055",
    directusToken: "",
    // Public address of the site, e.g. https://wedding.example.com, for the
    // link-preview image (server/plugins/link-preview.ts). Optional: when
    // empty, the address the request came in on is used. NUXT_SITE_URL.
    siteUrl: "",
  },

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
        //   Lexend          — English text across the invitation, Medium only
        //   Pacifico        — the envelope, and the couple's names everywhere
        //   Lobster         — the welcome slideshow only
        //   Moul            — Khmer headings
        //   Kantumruy Pro   — Khmer body
        families: {
          // Only Medium is loaded, so every English line resolves to it
          // whatever weight its rule asks for.
          "Lexend": [500],
          "Pacifico": [400],
          "Lobster": [400],
          "Moul": [400],
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
        // viewport-fit=cover lets the page paint under the notch and the
        // home indicator; fixed controls step clear of them with
        // env(safe-area-inset-*).
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        // Tints the phone's status bar / browser chrome to the page. The
        // welcome cover swaps it for its own dark while it is showing.
        { name: "theme-color", content: "#eef0e9" },
      ],
      link: [
        // The gold wax seal from the envelope, as the tab and home-screen icon.
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
