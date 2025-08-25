<template>
    <NuxtLayout>
        <ClientOnly>
            <SentryInit/>
        </ClientOnly>
        <v-app>
            <Snackbars/>
<!--            <NewWebsiteBanner/>-->
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

const description = 'Automate Minecraft skin signing with MineSkin – Get signed textures in seconds.';

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
        ...(i18nHead.value.link || []),
        {
            rel: 'icon',
            type: 'image/png',
            href: '/img/mineskin-x64.png',
            id: 'skin-icon'
        }
    ],
    meta: [
        ...(i18nHead.value.meta || [])
    ],
    script: [
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
            innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5KV5S2GC');`
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
                        "urlTemplate": "https://mineskin.org/skins?search={search_term_string}"
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