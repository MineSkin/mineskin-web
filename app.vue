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

.green {
  background-color: green !important;
}
.red {
  background-color: red !important;
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
                        {{ breakpoint }}
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
                    align-tabs="end"
                >
                    <v-tab :to="localePath('/')">
                        <span v-if="mdAndUp">{{ $t("Generate") }}</span>
                        <v-icon v-else icon="mdi-home"></v-icon>
                    </v-tab>
                    <v-tab :to="localePath('/skins')">
                        <span v-if="mdAndUp">{{ $t("Gallery") }}</span>
                        <v-icon v-else icon="mdi-image-search"></v-icon>
                    </v-tab>
                    <v-tab v-if="authStore.authed" :to="localePath('/my-skins')">
                        <span v-if="mdAndUp">{{ $t("My Skins") }}</span>
                        <v-icon v-else icon="mdi-view-grid"></v-icon>
                    </v-tab>
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
            <v-main style="--v-layout-top: 56px" :class="dbgClass">
                <LoadingIndicator style="margin-top: var(--v-layout-top)"/>
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
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const {smAndUp, mdAndUp,name:breakpoint} = useDisplay();
const {$ssrClientHints} = useNuxtApp();
console.log($ssrClientHints)

const dbgClass=ref('');
watch(mdAndUp,(val)=>{
    console.log(val);
    dbgClass.value = val?'green':'red'
},{immediate:true})

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
            src: '//cdn.cookie-script.com/s/639a4b90a98c39ff998dc9c06ffa14b9.js',
            tagPosition: 'head'
        },
        {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-5GVV9RF5HZ',
            async: true,
            'data-cookie-consent': 'tracking',
            tagPosition: 'head'
        },
        {
            innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5GVV9RF5HZ');
            `,
            'data-cookie-consent': 'tracking',
            tagPosition: 'head'
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
    ]
}, {mode: 'client'})

const router = useRouter();
// const showNav = computed(()=>{
//     return router.currentRoute.value.path === "/"||router.currentRoute.value.path === "/gallery";
// })

const authStore = useAuthStore();
const queueStore = useQueueStore();
const skinStore = useSkinStore();

const isHydrated = ref(false);



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
    isHydrated.value = true;
})

</script>