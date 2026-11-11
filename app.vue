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
            <LazyDevOverridesDialog v-if="config.public.isDev"/>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import RightNavDrawer from "~/components/RightNavDrawer.vue";
import MainFooter from "~/components/MainFooter.vue";
import SentryInit from "~/components/SentryInit.vue";
import { onMounted, onUnmounted } from "vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";
import MainAppBar from "~/components/MainAppBar.vue";

const config = useRuntimeConfig();

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
            src: '/google-offerwall-check.js',
            async: true,
            tagPosition: 'head'
        },
        // Google Analytics: blocked until the visitor allows performance cookies (cookie consent library,
        // see util/cookieConsent.ts). Client-only, so the library activates each tag once.
        {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-5GVV9RF5HZ',
            async: true,
            type: 'text/plain',
            'data-cookiescript': 'accepted',
            'data-cookiecategory': 'performance',
            tagPosition: 'head'
        },
        {
            innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5GVV9RF5HZ');
            `,
            type: 'text/plain',
            'data-cookiescript': 'accepted',
            'data-cookiecategory': 'performance',
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

// prevent the browser from navigating away to display the raw file when a
// dragged image is dropped just outside the upload drop zone
function preventDefaultDrag(e: DragEvent) {
    e.preventDefault();
}

onMounted(() => {
    isHydrated.value = true;
    window.addEventListener('dragover', preventDefaultDrag);
    window.addEventListener('drop', preventDefaultDrag);
})

onUnmounted(() => {
    window.removeEventListener('dragover', preventDefaultDrag);
    window.removeEventListener('drop', preventDefaultDrag);
})

</script>