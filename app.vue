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
        <ClientOnly>
            <SentryInit/>
        </ClientOnly>
        <v-app>
            <Snackbars/>
            <NewWebsiteBanner/>
            <v-app-bar density="comfortable" class="px-4" color="mskindigo">
                <v-img
                    src="~/assets/img/mineskin-x64.png"
                    aspect-ratio="1"
                    max-width="40"
                    max-height="40"
                    @click="router.push(localePath('/'))"
                ></v-img>
                <v-app-bar-title class="flex-0-1">
                    <nuxt-link v-if="mdAndUp" class="app-bar-link" :to="localePath('/')">
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
                           v-if="mdAndUp"
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
                    <v-tab :to="localePath('/')">{{ $t("Generate") }}</v-tab>
                    <v-tab :to="localePath('/skins')">{{ $t("Gallery") }}</v-tab>
                    <v-tab v-if="authStore.authed" :to="localePath('/my-skins')">{{ $t("My Skins") }}</v-tab>
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
                            {{ $t("Show Jobs") }}
                        </v-tooltip>
                    </v-btn>


                    <v-avatar
                        class="ml-2"
                        color="info"
                    >
                        <a v-if="authStore.authed" class="img-link" href="https://account.mineskin.org"
                           @click.prevent="jobsDrawer = !jobsDrawer">
                            <v-img :src="authStore.user?.picture" alt="User Avatar"></v-img>
                        </a>
                        <v-btn v-else icon>
                            <a class="img-link text-white"
                               @click.prevent="jobsDrawer = !jobsDrawer"
                               href="https://account.mineskin.org/">
                                <v-icon>mdi-account</v-icon>
                            </a>
                        </v-btn>
                    </v-avatar>
                </template>

            </v-app-bar>
            <v-main style="--v-layout-top: 56px">
                <NuxtPage/>
            </v-main>
            <MainFooter/>
            <RightNavDrawer/>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";
import RightNavDrawer from "~/components/RightNavDrawer.vue";
import MainFooter from "~/components/MainFooter.vue";
import SentryInit from "~/components/SentryInit.vue";
import { onMounted } from "vue";

const config = useRuntimeConfig();

const localePath = useLocalePath();

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
});

const i18nHead = useLocaleHead({});

useHead({
    htmlAttrs: {
        lang: i18nHead.value.htmlAttrs?.lang || 'en'
    },
    link: [
        ...(i18nHead.value.link || [])
    ],
    meta: [
        ...(i18nHead.value.meta || [])
    ],
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
                "url": "https://mineskin.org/",
                "name": "MineSkin",
                "alternateName": "mineskin.org",
                "description": description,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://mineskin.org/skins?filter={search_term_string}"
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
const skinStore = useSkinStore();

const {smAndUp, mdAndUp} = useDisplay();

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
        path: '/skins',
        query: {
            filter: filter.value
        },
        force: true,
    });
}

const loginRedirect = () => {
    authStore.reset();
    window.location.href = 'https://account.mineskin.org/login?redirect=https://mineskin.org/';
}

onBeforeMount(() => {
    if (process.client) {
        try {
            authStore.checkAuth();
        } catch (e) {
            console.error(e)
        }
    }
});

onMounted(() => {
    if (process.client) {
        try {
            const legacyStorageStr = localStorage.getItem("ngStorage-recentSkins");
            if (legacyStorageStr) {
                localStorage.setItem("ngStorage-recentSkins-legacy", legacyStorageStr);
                console.info("Migrating legacy skin storage");
                const parsed = JSON.parse(legacyStorageStr);
                for (let id of parsed) {
                    skinStore.addSkin(id);
                }
                localStorage.removeItem("ngStorage-recentSkins");
            }
        } catch (e) {
            console.error(e)
        }
    }
})
</script>