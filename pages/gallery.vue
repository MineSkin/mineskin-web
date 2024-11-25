<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Skin Gallery</h2>
            </v-col>
        </v-row>
        <v-infinite-scroll :items="skins" :onLoad="load" style="overflow: hidden">
            <v-row justify="center" dense>
                <template v-for="(item0, index) in skins" :key="item0">
                    <!--                    <v-col cols="4" sm="3" md="2">-->
                    <v-col
                        :cols="item0.ad? 12:6"
                        :sm="item0.ad?8:4"
                        :md="item0.ad?4:2"
                        :xl="item0.ad?2:1"
                        class="gallery-item-group"
                        :class="item0.ad?'mx-4':'mx-2'"
                    >
                        <div v-if="item0.ad"
                             style="max-height: 1200px;width:100%"
                        >
                            <ad-wrappper
                                ad-format="fluid"
                                ad-layout-key="+1i+s2-10-1k+6v"
                                ad-slot="3361952161"
                            />
                        </div>
                        <div v-else class="gallery-item mb-4" v-for="item in item0" :key="item">
                            <skin-link-card no-title :skin="item"/>
                        </div>
                    </v-col>
                    <!--                    </v-col>-->
                </template>
            </v-row>
        </v-infinite-scroll>
        <v-row justify="center">
            <div class="gallery-item mb-4" v-for="n in 20" :key="n">
                <skin-link-card no-title/>
            </div>
        </v-row>
        <!--            <v-col v-for="skin in skins">-->
        <!--                <v-card>-->
        <!--                    <v-card-text>-->
        <!--                        {{ skin }}-->
        <!--                    </v-card-text>-->
        <!--                </v-card>-->
        <!--            </v-col>-->
    </v-container>
</template>
<script setup lang="ts">
import { useNuxtApp } from "#app";
import type { Maybe } from "@mineskin/types";
import type { ListedSkin } from "~/types/SkinListResponse";
import { useAuthStore } from "~/stores/auth";
import { useGalleryStore } from "~/stores/gallery";
import { onMounted } from "#imports";
import { computedAsync, useDebounceFn, useThrottleFn } from '@vueuse/core'

useHead({
    title: 'Gallery',
    link: [{
        rel: 'canonical',
        href: 'https://beta.mineskin.org/gallery'
    }],
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Gallery",
            "url": `https://beta.mineskin.org/gallery`
        })
    }]
});

const router = useRouter();
const {xl, lg, md, sm, xs} = useDisplay();

const {$mineskin, $flags, $notify} = useNuxtApp();

const authStore = useAuthStore();
const galleryStore = useGalleryStore();
const {galleryItems, galleryScroll} = storeToRefs(galleryStore);

const adFree = computed(() => authStore.grants?.ad_free);

const filter = computed<string>(() => {
    return router.currentRoute.value.query.filter || '';
});

const adsOnPage = ref(0);

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });

const skins = ref<Array<Array<ListedSkin> | { ad: boolean }>>([]);
const after = ref<string | null>(null);
const hasNext = ref(true);

async function api() {
    if (!hasNext.value) return [];
    const toLoad = 80 - (adsOnPage.value * 4);
    const response = await $mineskin.skins.list(after.value, toLoad, filter.value);
    console.debug(response);
    const skins = response?.skins || [];
    hasNext.value = skins.length > 0;
    if (skins.length > 0) {
        after.value = skins[skins.length - 1].uuid!;
        // preload next
        $mineskin.skins.list(after.value, toLoad, filter.value);
    } else {
        $notify({
            text: "No skins found",
            color: "info"
        })
    }
    return skins;
    // return new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve(Array.from({ length: 10 }, (k, v) => v + items.value.at(-1) + 1))
    //     }, 1000)
    // })
}

async function load({done}) {
    console.debug('load')
    // Perform API call
    const res = await api();
    if (res.length === 0) {
        done('empty');
        return;
    }

    // push skins, grouping by 2
    const grouped = res.reduce((acc, item, index) => {
        if (index % 2 === 0) {
            acc.push([item]);
        } else {
            acc[acc.length - 1].push(item);
        }
        return acc;
    }, [] as ListedSkin[][]);
    if (!adFree.value && inlineAdRate.value != 0 && Math.random() < inlineAdRate.value) {
        grouped.splice((Math.floor(Math.floor(Math.random() * grouped.length) / 2) * 2) + 1, 0, {ad: true});
        adsOnPage.value++;
    }
    skins.value.push(...grouped);
    galleryItems.value = skins.value;

    done('ok')
}

const inlineAdRate = computed(() => Number($flags.getValue('web.ads.gallery_inline_rate', {
    fallback: .6
})));

const handleScroll = useThrottleFn((e: Event) => {
    galleryScroll.value = window.scrollY;
}, 200, true, false);

onMounted(async () => {
    skins.value = galleryItems.value;
    window.addEventListener('scroll', handleScroll, {passive: true});
    window.scrollTo(0, galleryScroll.value);

    await load({
        done: () => {
        }
    })
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>