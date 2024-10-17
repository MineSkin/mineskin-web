<style>
.app-bar-link {
    color: white;
    text-decoration: none;
    cursor: pointer;
}

.img-link {
    width: 100%;
    height: 100%;
}
</style>
<template>
    <NuxtLayout>
        <v-app>
            <Snackbars/>
            <v-app-bar density="comfortable" class="px-4">
                <v-app-bar-title>
                    <nuxt-link class="app-bar-link" to="/">
                        MineSkin
                        <v-chip
                            density="compact"
                            :color="config.public.isDev ? 'warning' :'secondary'"
                            variant="flat"
                        >
                            {{ config.public.isDev ? 'Dev Mode' : 'Beta' }}
                        </v-chip>
                    </nuxt-link>
                    <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </v-app-bar-title>

                <v-spacer></v-spacer>

                <v-tabs
                    align-tabs="center"
                >
                    <v-tab to="/">Generate</v-tab>
                    <v-tab to="/gallery">Gallery</v-tab>
                </v-tabs>

                <v-divider vertical class="mx-4 my-2"/>

                <template v-slot:append>
                    <v-btn icon @click="queueStore.jobsDrawer = !queueStore.jobsDrawer">
                        <component :is="queueStore?.jobs?.length>0?'v-badge':'div'"
                                   :content="queueStore?.jobs?.length"
                                   location="bottom right"
                        >
                            <v-icon icon="mdi-list-status"></v-icon>
                        </component>
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                        >
                            Show Jobs
                        </v-tooltip>
                    </v-btn>


                    <v-avatar
                        class="ml-2"
                        color="info"
                    >
                        <a v-if="authStore.authed" class="img-link" href="https://account.mineskin.org">
                            <v-img :src="authStore.user?.picture" alt="User Avatar"></v-img>
                            <v-tooltip
                                activator="parent"
                                location="bottom"
                            >
                                Go to Account
                            </v-tooltip>
                        </a>
                        <v-btn v-else icon>
                            <a class="img-link text-white" href="https://account.mineskin.org">
                                <v-icon>mdi-account</v-icon>
                                <v-tooltip
                                    activator="parent"
                                    location="bottom"
                                >
                                    Sign In
                                </v-tooltip>
                            </a>
                        </v-btn>
                    </v-avatar>
                </template>

            </v-app-bar>
            <v-main style="--v-layout-top: 56px">
                <NuxtPage/>
            </v-main>
            <v-navigation-drawer
                v-model="queueStore.jobsDrawer"
                location="end"
                temporary
                width="320"
            >
                <v-list>
                    <v-list-subheader v-if="authStore.authed">Credits</v-list-subheader>
                    <v-list-item v-if="authStore.authed">
                        <CreditsInfo/>
                    </v-list-item>
                </v-list>
                <JobList class="my-2"/>
            </v-navigation-drawer>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";

const config = useRuntimeConfig();


useHead({
    script: [
        {

            src: '//www.termsfeed.com/public/cookie-consent/4.1.0/cookie-consent.js',
            tagPosition: 'bodyOpen'
        },
        {
            innerHTML: `
        var runCookieConsent = function () {
            if(!window.cookieconsent) {
                console.error('CookieConsent not loaded');
                setTimeout(runCookieConsent, 1000);
                return;
            }
            cookieconsent.run({
                "notice_banner_type":"simple",
                "consent_type":"express",
                "palette":"dark",
                "language":"en",
                "page_load_consent_levels":["strictly-necessary"],
                "notice_banner_reject_button_hide":false,
                "preferences_center_close_button_hide":false,
                "page_refresh_confirmation_buttons":false,
                "website_name":"MineSkin"
            });
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runCookieConsent);
        } else {
            runCookieConsent();
        }
    `,
            tagPosition: 'bodyOpen'
        },

        {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-5GVV9RF5HZ',
            async: true,
            'data-cookie-consent': 'tracking',
            tagPosition: 'bodyClose'
        },
        {
            innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5GVV9RF5HZ');
            `,
            'data-cookie-consent': 'tracking',
            tagPosition: 'bodyClose'
        }
    ],
    noscript: [
        {
            innerHTML: 'Free cookie consent management tool by <a href="https://www.termsfeed.com/">TermsFeed</a>',
            tagPosition: 'bodyClose'
        }
    ]
}, {mode: 'client'})

const router = useRouter();
// const showNav = computed(()=>{
//     return router.currentRoute.value.path === "/"||router.currentRoute.value.path === "/gallery";
// })

const authStore = useAuthStore();
const queueStore = useQueueStore();

onBeforeMount(() => {
    authStore.checkAuth();
})
</script>