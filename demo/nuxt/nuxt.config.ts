// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/main.css'],
  devtools: { enabled: true },
  components: [
    {
      path: '~/components',
      // JLDS installs each component with a barrel file (ui/button/index.ts).
      // Nuxt would resolve both it and Button.vue to <UiButton>, so only scan
      // the .vue files and leave the barrels for explicit imports.
      ignore: ['**/index.ts']
    }
  ]
})
