// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    ssr: false,
    plugins: [
        '@/plugins/logger',
        '@/plugins/notifier',
        '@/plugins/mineskin',
        '@/plugins/account',
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
                defaultTheme: 'dark'
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
            sentryDsn: process.env.SENTRY_DSN
        }
    },
})