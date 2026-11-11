<template>
    <v-row>
        <v-col cols="12">
            <h2 v-if="mode==='popular'">Popular Skins</h2>
            <h2 v-else>{{ $t("Skin Gallery") }}
                <v-chip
                    v-if="displayFilter"
                    class="ma-2"
                    size="large"
                    closable
                    @click:close="clearFilter()"
                >
                    {{ displayFilter }}
                </v-chip>
                <v-btn icon
                       v-if="!mdAndUp && !displayFilter"
                       :aria-label="$t('Search Skins')"
                       @click="searching ? search() : showSearch()"
                       variant="text"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </h2>
        </v-col>
        <v-col cols="12" v-if="searchBlocked">
            <v-alert variant="tonal">{{ $t("This search term isn't allowed.") }}</v-alert>
        </v-col>
        <v-expand-x-transition v-if="!mdAndUp">
            <v-text-field
                v-show="searching"
                ref="searchField"
                density="compact"
                v-model="searchFilter"
                placeholder="Search"
                append-inner-icon="mdi-close"
                @click:append-inner="searchFilter = ''; searching = false"
                @keydown.enter="searching = false; search()"
                @keydown.esc="searching = false"
                hide-details
                single-line
                min-width="20vw"
            />
        </v-expand-x-transition>
    </v-row>
    <v-row class="text-center" v-if="adsAllowed">
        <ad-info-wrapper>
            <template #default>
                <ad-wrappper ad-slot="7045370598"/>
<!--                <ad-manager-wrappper-->
<!--                    ad-slot="/23325865428/msk_am_gallery_top_banner"-->
<!--                    ad-id="div-gpt-ad-1772183672799-0"-->
<!--                    />-->
            </template>
        </ad-info-wrapper>
    </v-row>
    <v-infinite-scroll v-if="!searchBlocked" :items="skins" :onLoad="load" style="overflow: hidden">
        <v-row justify="center" dense>
            <template v-for="(item0, index) in skins" :key="item0">
                <!--                    <v-col cols="4" sm="3" md="2">-->
                <v-col
                    :cols="item0.ad? 12:5"
                    :xs="item0.ad? 12:5"
                    :sm="item0.ad?8:3"
                    :md="item0.ad?4:2"
                    :lg="item0.ad?4:2"
                    :xl="item0.ad?2:1"
                    class="gallery-item-group"
                    :class="item0.ad?'mx-4':'mx-0 mx-sm-1 mx-md-2'"
                >
                    <div v-if="item0.ad"
                         style="width:100%"
                    >
                        <template v-if="adsAllowed">
                            <dbg :data="{t:item0.adType}"/>
                            <fluid-ad-wrapper
                                v-if="item0.adType===1"
                                ad-layout-key="+1i+s2-10-1k+6v"
                                ad-slot="3361952161"
                                no-fallback
                            />
                            <multiplex-ad-wrapper
                                v-else-if="item0.adType===2"
                                ad-slot="8545261932"
                                ui-type="image_stacked"
                                no-fallback
                                :rows="1"
                                :cols="1"
                            />
                            <display-ad-wrapper
                                v-else-if="item0.adType===3"
                                ad-slot="2426312811"
                                no-fallback
                                :height="400"
                                :width="380"
                            />
                        </template>
                    </div>
                    <div v-else class="gallery-item mb-1 mb-sm-2 mb-md-4" v-for="item in item0" :key="item">
                        <skin-link-card no-title :skin="item"/>
                    </div>
                </v-col>
                <!--                    </v-col>-->
            </template>
        </v-row>
        <template v-slot:loading>
        </template>
    </v-infinite-scroll>
    <v-row justify="center" dense v-if="hasNext && !searchBlocked">
        <v-col v-for="n in 20" :key="n"
               cols="5"
               xs="5"
               sm="3"
               md="2"
               lg="2"
               xl="1"
               class="mx-0 mx-sm-1 mx-md-2"
        >
            <div class="gallery-item mb-1 mb-sm-2 mb-md-4">
                <skin-link-card no-title/>
            </div>
        </v-col>
    </v-row>
    <!--            <v-col v-for="skin in skins">-->
    <!--                <v-card>-->
    <!--                    <v-card-text>-->
    <!--                        {{ skin }}-->
    <!--                    </v-card-text>-->
    <!--                </v-card>-->
    <!--            </v-col>-->
</template>
<script setup lang="ts">
import { onBeforeRouteUpdate, useAsyncData, useNuxtApp } from "#app";
import type { Maybe } from "@mineskin/types";
import type { ListedSkin, SkinListResponse } from "~/types/SkinListResponse";
import { useAuthStore } from "~/stores/auth";
import { useGalleryStore } from "~/stores/gallery";
import { onMounted } from "#imports";
import { computedAsync, useDebounceFn, useThrottleFn } from '@vueuse/core'
import FluidAdWrapper from "~/components/ad/FluidAdWrapper.vue";
import MultiplexAdWrapper from "~/components/ad/MultiplexAdWrapper.vue";
import DisplayAdWrapper from "~/components/ad/DisplayAdWrapper.vue";
import AdWrappper from "~/components/ad/AdWrappper.vue";
import AdInfoWrapper from "~/components/ad/AdInfoWrapper.vue";
import { computed } from "vue";
import { capitalizeFirstLetter } from "~/util/misc";
import AdManagerWrappper from "~/components/ad/AdManagerWrappper.vue";

const router = useRouter();
const {xl, lg, md, sm, xs, name: breakpoint, mdAndUp} = useDisplay();

const {$mineskin, $flags, $notify} = useNuxtApp();
const {t: $t} = useI18n();

const authStore = useAuthStore();
const galleryStore = useGalleryStore();
const {galleryItems, galleryAnchor, galleryScroll, galleryKey} = storeToRefs(galleryStore);

const searching = ref(false);
const searchFilter = ref('');
const searchField = useTemplateRef('searchField');

const showSearch = () => {
    searching.value = true;
    setTimeout(() => {
        searchField.value.focus();
    }, 0);
}

const search = () => {
    searching.value = false;
    if (searchFilter.value === '') {
        return;
    }
    router.push({
        path: '/skins',
        query: {
            search: searchFilter.value
        },
        force: true,
    });
}

const props = withDefaults(defineProps<{
    mode?: 'latest' | 'popular' | 'random';
}>(), {
    mode: 'latest'
});

const adFree = computed(() => authStore.grants?.ad_free);

const filter = ref<string>(router.currentRoute.value.query.filter as string || router.currentRoute.value.query.search as string || '');
watch(() => router.currentRoute.value.query.filter, (newVal) => {
    filter.value = newVal as string;
    reloadNuxtApp({
        ttl: 100
    });
});
watch(() => router.currentRoute.value.query.search, (newVal) => {
    filter.value = newVal as string;
    reloadNuxtApp({
        ttl: 100
    });
});

const clearFilter = () => {
    filter.value = '';
    router.push({
        query: {
            search: undefined,
            filter: undefined
        }
    });
}

const isSearchBlocked = (response: Maybe<SkinListResponse>) => !!response?.warnings?.some(warning => warning.code === 'search_blocked');

// For searches, ask the MineSkin API during SSR whether the term is blocked, so the server-rendered head and heading
// never echo a blocked term. Only the flag ends up in the (cached) HTML; the browser still loads the skins itself.
const {data: blockedOnServer} = useAsyncData<boolean>(`skin-gallery-blocked-${ props.mode }-${ filter.value }`, async () => {
    if (!filter.value) return false;
    // silent: API errors here would otherwise end up as snackbars in the cached HTML; the browser's own request reports them
    return isSearchBlocked(await $mineskin.skins.list(undefined, 80, filter.value, props.mode, {silent: true}));
}, {immediate: import.meta.server});
// set by the browser's own first list response
const blockedOnClient = ref(false);
const firstPageLoaded = ref(false);
// identifies this gallery's items in the gallery store
const storeKey = `${ props.mode }:${ filter.value }`;

const searchBlocked = computed(() => !!filter.value && (!!blockedOnServer.value || blockedOnClient.value));
// the search term as shown on the page; a blocked term is never echoed back
const displayFilter = computed(() => searchBlocked.value ? '' : filter.value);
// Searches get ads only once the browser's own first page has arrived and the term isn't blocked:
// the AdSense crawler must not find a single ad unit on the page of a blocked term.
const adsAllowed = computed(() => !filter.value || (firstPageLoaded.value && !searchBlocked.value));
// After a client-side navigation from a page with ads, adsbygoogle.js is already loaded and AdSense Auto ads could
// still place ads on the blocked search. A full reload renders it without loading adsbygoogle.js at all.
watch(searchBlocked, blocked => {
    if (blocked && import.meta.client && (window as any).adsbygoogle?.loaded) {
        reloadNuxtApp();
    }
}, {immediate: true});

const pageTitle = computed(() => {
    if (displayFilter.value) {
        return capitalizeFirstLetter(displayFilter.value) + ' Minecraft Skins';
    }
    if (props.mode === 'latest') {
        return 'Latest Minecraft Skins';
    }
    if (props.mode === 'popular') {
        return 'Popular Minecraft Skins';
    }
    if (props.mode === 'random') {
        return 'Random Minecraft Skins';
    }
    return 'Gallery';
});
const pageLink = computed(() => {
    if (displayFilter.value) {
        return `https://mineskin.org/skins?search=${ encodeURIComponent(displayFilter.value) }`;
    }
    if (props.mode === 'latest') {
        return 'https://mineskin.org/skins';
    }
    if (props.mode === 'popular') {
        return 'https://mineskin.org/skins/popular';
    }
    if (props.mode === 'random') {
        return 'https://mineskin.org/skins/random';
    }
    return 'https://mineskin.org/skins';
});

const ldJsonContent = computed(() => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle.value,
    "url": pageLink.value
}));
const ldBreadcrumbContent = computed(() => {
    const items = [];
    if (displayFilter.value || props.mode === 'popular' || props.mode === 'random') {
        items.push({
            "@type": "ListItem",
            "position": 1,
            "name": 'Gallery',
            "item": 'https://mineskin.org/skins'
        });
        items.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageTitle.value,
            "item": pageLink.value
        });
    } else {
        items.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageTitle.value,
            "item": pageLink.value
        });
    }

    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    })
})
useHead({
    title: pageTitle,
    link: [{
        rel: 'canonical',
        href: pageLink
    }],
    meta: computed(() => searchBlocked.value ? [{name: 'robots', content: 'noindex'}] : []),
    script: computed(() => searchBlocked.value ? [] : [
        {
            type: 'application/ld+json',
            innerHTML: ldJsonContent.value
        },
        {
            type: 'application/ld+json',
            innerHTML: ldBreadcrumbContent.value
        }
    ])
});


const adsOnPage = ref(0);

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });

const skins = ref<Array<Array<ListedSkin> | { ad: boolean; adType: number; }>>([]);
const after = ref<string | null>(null);
const pageIndex = ref(0);
const hasNext = ref(true);

async function api() {
    if (!hasNext.value) return [];
    const toLoad = 80 - (adsOnPage.value * 4);
    const response = await $mineskin.skins.list(after.value, toLoad, filter.value, props.mode);
    console.debug(response);
    if (isSearchBlocked(response)) {
        blockedOnClient.value = true;
        hasNext.value = false;
        return [];
    }
    if (Array.isArray(response?.skins)) {
        firstPageLoaded.value = true;
    }
    const skins = response?.skins || [];
    hasNext.value = skins.length >= toLoad;
    if (hasNext.value) {
        let nextAfter = skins[skins.length - 1].uuid!;
        // hacky "fix" for a weird edge-case where the gallery infinitely shows the same set of skins
        if (nextAfter === after.value) {
            console.warn("nextAfter == after", nextAfter, after.value);
            nextAfter = skins[skins.length - 2].uuid!
        }
        after.value = nextAfter;

        pageIndex.value++;
        galleryAnchor.value = after.value;
        // preload next
        $mineskin.skins.list(after.value, toLoad, filter.value, props.mode);
    }
    return skins;
}

async function load({done}) {
    console.debug('load')
    // Perform API call
    let res;
    try {
        res = await api();
    } catch (e) {
        console.error('Failed to load skins', e);
        $notify({
            text: $t("Failed to load skins. Please try again."),
            color: "error"
        });
        done('error');
        return;
    }
    if (res.length === 0) {
        done('empty');
        // a blocked search shows its own message instead
        if (pageIndex.value === 0 && !searchBlocked.value) {
            $notify({
                text: $t("No more skins found"),
                color: "info"
            })
        }
        return;
    }


    const grouped = res
        // make sure we're not adding the same skins
        .filter((item) => {
            const existingIndex = skins.value.findIndex(group => {
                if (Array.isArray(group)) {
                    return group.findIndex(skin => skin.uuid === item.uuid) !== -1;
                }
                return false;
            });
            return existingIndex === -1;
        })
        // push skins, grouping by 2
        .reduce((acc, item, index) => {
            if (index % 2 === 0) {
                acc.push([item]);
            } else {
                acc[acc.length - 1].push(item);
            }
            return acc;
        }, [] as ListedSkin[][]);
    if (!adFree.value && inlineAdRate.value != 0) {
        if (adsOnPage.value === 0) {
            grouped.splice(Math.floor(Math.random() * (mdAndUp.value ? 4 : 2)) + 2, 0, {
                ad: true,
                adType: getAdType()
            });
            adsOnPage.value++;
        } else if (Math.random() < inlineAdRate.value) {
            grouped.splice((Math.floor(Math.floor(Math.random() * grouped.length) / 2) * 2) + 1, 0, {
                ad: true,
                adType: getAdType()
            });
            adsOnPage.value++;
        }
    }
    skins.value.push(...grouped);
    galleryItems.value = skins.value;
    galleryKey.value = storeKey;

    done('ok')
}

const inlineAdRate = computed(() => Number($flags.getValue('web.ads.gallery_inline_rate', {
    fallback: .6
})));

const getAdType = () => {
    const options = [1, 2, 3];
    return options[Math.floor(Math.random() * options.length)];
}

const handleScroll = useThrottleFn((e: Event) => {
    galleryScroll.value = window.scrollY;
}, 200, true, false);

onMounted(async () => {
    if (galleryKey.value === storeKey) {
        // back on the same gallery/search: restore its skins, which also count as its first page
        skins.value = galleryItems.value;
        after.value = galleryAnchor.value;
        if (galleryItems.value.length > 0) {
            firstPageLoaded.value = true;
        }
    } else {
        // the stored skins belong to another mode or search
        galleryItems.value = [];
        galleryAnchor.value = null;
        galleryScroll.value = 0;
        galleryKey.value = storeKey;
    }
    window.addEventListener('scroll', handleScroll, {passive: true});
    window.scrollTo(0, galleryScroll.value);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>