const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: 'Carroll\'s Letters - %s',
    title: 'Home',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', name: 'site_name', content: 'Carroll\'s Letters' },
      { hid: 'description', name: 'description', content: "This website is intended as a platform to host my grandfather Carroll Smith's letters to his mother spanning the years 1956 to 1975. The letters were originally transcribed by hand by my aunt Lisa, and then converted by me, Carroll's grandson Isaac, into a web-accessible format" },
      { hid: 'og:description', name: 'og:description', content: "This website is intended as a platform to host my grandfather Carroll Smith's letters to his mother spanning the years 1956 to 1975. The letters were originally transcribed by hand by my aunt Lisa, and then converted by me, Carroll's grandson Isaac, into a web-accessible format" },
      { hid: 'og:image', name: 'og:image', content: `${BASE_URL || ''}/images/1653cbe558888ddab4e87773d8ae4211_html_9e1c2d2c.jpg` },
      { hid: 'og:image:alt', name: 'og:image:alt', content: 'All of Carroll\'s letters spread out on a table, bound by binder clips' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    baseUrl: BASE_URL
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['plugins/vuetify'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://google-fonts.nuxtjs.org
    '@nuxtjs/google-fonts'
  ],

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        light: {
          primary: '#2196f3',
          secondary: '#f44336',
          accent: '#ffeb3b',
          error: '#ff5722',
          warning: '#ffc107',
          info: '#607d8b',
          success: '#4caf50'
        },
        dark: {
          primary: '#2196f3',
          secondary: '#f44336',
          accent: '#ffeb3b',
          error: '#ff5722',
          warning: '#ffc107',
          info: '#607d8b',
          success: '#4caf50'
        }
      }
    }
  },

  // Google fonts module configuration (https://google-fonts.nuxtjs.org/options)
  googleFonts: {
    families: {
      'Roboto Slab': [400],
      Rochester: true,
      'Noto Serif': true
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  }
}
