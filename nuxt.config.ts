// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || "",
  },
  experimental: { appManifest: false },
  modules: ["@nuxt/icon", "@nuxt/image"],
  compatibilityDate: "2024-12-18",
});
