// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    app: {
        head: {}
    },
    ssr: true,
    routeRules: {
        '/my-skins': {ssr: false},
        '/gallery': {redirect: '/skins'}
    },
    plugins: [
        '@/plugins/sentry',
        '@/plugins/logger',
        '@/plugins/notifier',
        '@/plugins/mineskin',
        '@/plugins/account',
        '@/plugins/flagsmith',
        '@/plugins/gtag',
    ],
    modules: [
        'vuetify-nuxt-module',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',

    ],
    vuetify: {
        moduleOptions: {
            /* module specific options */
        },
        vuetifyOptions: {
            labComponents: 'VSnackbarQueue',
            theme: {
                defaultTheme: 'mineskin',
                themes: {
                    mineskin: {
                        dark: true,
                        colors: {
                            mskindigo: '#3f51b5ff',
                            primary: '#4EA5D9',
                            secondary: '#44CFCB',
                            accent: '#65B891',
                            brown: '#562C2C',
                            mskred: '#F2542D'
                        }
                    }
                }
            },
        }

    },

    i18n: {
        strategy: 'prefix_and_default',
        baseUrl: 'https://beta.mineskin.org',
        defaultLocale: 'en',
        lazy: true,
        locales: [
            {code: 'en', language: 'en-US', name: 'English', file: 'en.json'},
            {code: 'de', language: 'de-DE', name: 'German', file: 'de.json'},
            {code: 'es', language: 'es-ES', name: 'Spanish', file: 'es.json'},
            {code: 'fr', language: 'fr-FR', name: 'French', file: 'fr.json'},
            {code: 'ru', language: 'ru-RU', name: 'Russian', file: 'ru.json'},
            {code: 'pl', language: 'pl-PL', name: 'Polish', file: 'pl.json'},
            {code: 'hi', language: 'hi-HI', name: 'Hindi', file: 'hi.json'},
            {code: 'pt', language: 'pt-PT', name: 'Portuguese', file: 'pt.json'},
            {code: 'id', language: 'id-ID', name: 'Indonesian', file: 'id.json'},
        ]
    },

    runtimeConfig: {
        public: {
            isDev: process.env.NODE_ENV === 'development',
            hosts: {
                mineskin: process.env.MINESKIN_HOST,
                account: process.env.ACCOUNT_HOST,
            },
            flagsmithEnvironment: process.env.FLAGSMITH_ENVIRONMENT,
            cfPagesCommitSha: process.env.CF_PAGES_COMMIT_SHA,
            cfPagesBranch: process.env.CF_PAGES_BRANCH,
            cfPagesUrl: process.env.CF_PAGES_URL,
            sentryDsn: process.env.SENTRY_DSN,
            google: {
                adsense: process.env.GOOGLE_ADSENSE
            },
            turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
        }
    },
})