// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2024-04-03',

    components: [
        {
            path: '~/components',
            extensions: ['.vue'],
        },
        {
            path: '~/components/ui',
            extensions: ['.vue'],
        },
    ],

    devtools: { enabled: true },

    modules: [
        '@nuxt/icon',
        // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@vueuse/nuxt',
        'nuxt-csurf',
        'shadcn-nuxt'
    ],

    css: [
        '~/assets/css/tailwind.scss',
        // our project css
        '~/assets/css/app.scss',
    ],

    routeRules: {
        '/api/login': {
            csurf: false
        },
        '/api/security/reset-password/**': {
            csurf: false
        },
        '/api/security/activate/**': {
            csurf: false
        },
    },

    runtimeConfig: {
        public: {
            // these env vars are available in the client runtime
            API_URL: process.env.API_URL,
            MAINTENANCE: process.env.MAINTENANCE,
            SITE_NAME: process.env.SITE_NAME,
            TABLE_PER_PAGE_DEFAULT: process.env.TABLE_PER_PAGE_DEFAULT,
        }
    },

    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './app/components/ui'
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler' // or "modern"
                }
            }
        }
    },

    $development: {
        modules: [
            '@nuxt/eslint',
        ]
    }
})
