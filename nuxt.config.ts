// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    css: ["~/assets/styles.css"],
    modules: ['@pinia/nuxt','@nuxt/test-utils/module'],
    ssr: false
})
