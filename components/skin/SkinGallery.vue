<template>
    <v-row>
        <v-col cols="12">
            <h2 v-if="mode==='popular'">Popular Skins</h2>
            <h2 v-else>{{ $t("Skin Gallery") }}
                <v-chip
                    v-if="filter"
                    class="ma-2"
                    size="large"
                    closable
                    @click:close="clearFilter()"
                >
                    {{ filter }}
                </v-chip>
                <v-btn icon
                       v-if="!mdAndUp && !filter"
                       @click="searching ? search() : showSearch()"
                       variant="text"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </h2>
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
    <v-row class="text-center">
        <ad-info-wrapper>
            <template #default>
                <!-- web v2 index middle banner -->
                <ad-wrappper ad-slot="7045370598"/>
            </template>
        </ad-info-wrapper>
    </v-row>
    <v-infinite-scroll :items="skins" :onLoad="load" style="overflow: hidden">
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
    <v-row justify="center" dense v-if="hasNext">
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
import { onBeforeRouteUpdate, useNuxtApp } from "#app";
import type { Maybe } from "@mineskin/types";
import type { ListedSkin } from "~/types/SkinListResponse";
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

const router = useRouter();
const {xl, lg, md, sm, xs, name: breakpoint, mdAndUp} = useDisplay();

const {$mineskin, $flags, $notify} = useNuxtApp();

const authStore = useAuthStore();
const galleryStore = useGalleryStore();
const {galleryItems, galleryAnchor, galleryScroll} = storeToRefs(galleryStore);

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

const pageTitle = computed(() => {
    if (filter.value) {
        return capitalizeFirstLetter(filter.value) + ' Minecraft Skins';
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
    if (filter.value) {
        return `https://mineskin.org/skins?search=${encodeURIComponent(filter.value)}`;
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

useHead({
    title: pageTitle,
    link: [{
        rel: 'canonical',
        href: pageLink
    }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": pageTitle.value,
                "url": pageLink.value
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": pageTitle.value,
                        "item": pageLink.value
                    }
                ]
            })
        }
    ]
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
    const skins = response?.skins || [];
    hasNext.value = skins.length > 0;
    if (skins.length > 0) {
        after.value = skins[skins.length - 1].uuid!;
        pageIndex.value++;
        galleryAnchor.value = after.value;
        // preload next
        $mineskin.skins.list(after.value, toLoad, filter.value, props.mode);
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
        if (pageIndex.value === 0) {
            $notify({
                text: $t("No more skins found"),
                color: "info"
            })
        }
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
    skins.value = galleryItems.value;
    after.value = galleryAnchor.value;
    window.addEventListener('scroll', handleScroll, {passive: true});
    window.scrollTo(0, galleryScroll.value);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>