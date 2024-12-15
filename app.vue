<template>
    <NuxtLayout>
        <ClientOnly>
            <SentryInit/>
        </ClientOnly>
        <v-app>
            <Snackbars/>
            <NewWebsiteBanner/>
            <MainAppBar/>
            <v-main style="--v-layout-top: 56px">
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
import RightNavDrawer from "~/components/RightNavDrawer.vue";
import MainFooter from "~/components/MainFooter.vue";
import SentryInit from "~/components/SentryInit.vue";
import { onMounted } from "vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";
import MainAppBar from "~/components/MainAppBar.vue";

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
}, {
    mode: 'client'
})

const authStore = useAuthStore();

const isHydrated = ref(false);

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