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

.v-footer {
    max-height: 14em;
}

@media (min-width: 400px) {
    .v-footer {
        max-height: 10em;
    }
}

@media (min-width: 600px) {
    .v-footer {
        max-height: 8em;
    }
}

@media (min-width: 800px) {
    .v-footer {
        max-height: 6em;
    }
}

@media (min-width: 1000px) {
    .v-footer {
        max-height: 4em;
    }
}

</style>
<template>
    <NuxtLayout>
        <v-app>
            <Snackbars/>
            <v-app-bar density="comfortable" class="px-4" color="mskindigo">
                <v-img
                    src="~/assets/img/mineskin-x64.png"
                    aspect-ratio="1"
                    max-width="40"
                    max-height="40"
                    @click="router.push('/')"
                ></v-img>
                <v-app-bar-title class="flex-0-1">
                    <nuxt-link v-if="mdAndUp" class="app-bar-link" to="/">
                        MineSkin
                        <v-chip
                            density="compact"
                            :color="config.public.isDev ? 'warning' :'secondary'"
                            variant="flat"
                        >
                            {{ config.public.isDev ? 'Dev Mode' : 'V2 Beta' }}
                        </v-chip>
                    </nuxt-link>
                </v-app-bar-title>

                <div class="d-flex flex-auto">
                    <v-btn icon
                           @click="searching ? search() : showSearch()"
                    >
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-expand-x-transition>
                        <v-text-field v-show="searching"
                                      ref="searchField"
                                      density="compact"
                                      v-model="filter"
                                      placeholder="Search"
                                      append-inner-icon="mdi-close"
                                      @click:append-inner="filter = ''; searching = false"
                                      @keydown.enter="searching = false; search()"
                                      @keydown.esc="searching = false"
                                      hide-details
                                      single-line
                                      min-width="20vw"
                        />
                    </v-expand-x-transition>
                </div>

                <v-spacer></v-spacer>

                <v-tabs
                    align-tabs="center"
                >
                    <v-tab to="/">Generate</v-tab>
                    <v-tab to="/gallery">Gallery</v-tab>
                    <v-tab v-if="authStore.authed" to="/my-skins">My Skins</v-tab>
                </v-tabs>

                <v-divider vertical class="mx-4 my-2"/>

                <template v-slot:append>
                    <v-btn icon @click="jobsDrawer = !jobsDrawer">
                        <component :is="jobsSorted?.length>0?'v-badge':'div'"
                                   :content="jobsSorted?.length"
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
                            <a class="img-link text-white" @click.prevent="loginRedirect()"
                               href="https://account.mineskin.org/">
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
            <v-footer :class="mdAndUp?'px-16':''">
                <v-row no-gutters justify="center">
                    <v-col>
                        <v-btn variant="text" href="https://legal.inventivetalent.org/imprint">Imprint</v-btn>
                        <v-btn variant="text" href="https://legal.inventivetalent.org/privacy/mineskin">Privacy</v-btn>
                        <v-btn variant="text" href="https://legal.inventivetalent.org/terms/mineskin">Terms</v-btn>
                        <a href="#" id="open_preferences_center">Cookie preferences</a>
                    </v-col>
                    <v-col class="text-center">
                        Copyright &copy; {{ new Date().getFullYear() }} <a href="https://inventivetalent.org"
                                                                           target="_blank">inventivetalent</a>
                    </v-col>
                    <v-col class="text-right">
                        Not affiliated with Minecraft / Mojang AB / Microsoft.
                    </v-col>
                </v-row>
            </v-footer>

            <v-navigation-drawer
                v-model="jobsDrawer"
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
import { storeToRefs } from "pinia";

const config = useRuntimeConfig();

const description = 'MineSkin.org allows you to generate skin texture data for Minecraft which is signed by Mojang.';

useSeoMeta({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${ titleChunk } - MineSkin` : 'MineSkin - Skin Signature Generator';
    },
    ogSiteName: 'MineSkin',
    ogImage: '/img/mineskin-social-card.jpg',
    description: description,
    ogDescription: description,
    twitterDescription: description,
    author: 'inventivetalent',
})

useHead({
    link: [{
        rel: 'canonical',
        href: 'https://beta.mineskin.org/'
    }],
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
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://beta.mineskin.org/",
                "name": "MineSkin",
                "alternateName": "mineskin.org",
                "description": description,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://beta.mineskin.org/gallery?filter={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            }),
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

const {mdAndUp} = useDisplay();

const {jobsSorted, jobsDrawer} = storeToRefs(queueStore);

const searching = ref(false);
const filter = ref('');
const searchField = useTemplateRef('searchField');

const showSearch = () => {
    searching.value = true;
    setTimeout(() => {
        searchField.value.focus();
    }, 0);
}

const search = () => {
    searching.value = false;
    if (filter.value === '') {
        return;
    }
    router.push({
        path: '/gallery',
        query: {
            filter: filter.value
        },
        force: true,
    });
}

const loginRedirect = () => {
    authStore.reset();
    window.location.href = 'https://account.mineskin.org/login?redirect=https://beta.mineskin.org/';
}

onBeforeMount(() => {
    authStore.checkAuth();
})
</script>