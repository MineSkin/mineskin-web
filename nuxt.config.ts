// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    app: {
        head: {}
    },
    ssr: true,
    routeRules: {
        '/': {ssr: false},
        '/gallery': {ssr: false},
        '/my-skins': {ssr: false}
    },
    plugins: [
        '@/plugins/logger',
        '@/plugins/notifier',
        '@/plugins/mineskin',
        '@/plugins/account',
        '@/plugins/flagsmith',
        '@/plugins/gtag',
    ],
    modules: [
        'vuetify-nuxt-module',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
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
            }
        }
    },
})