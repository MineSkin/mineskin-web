<style>
.line-break-anywhere {
    line-break: anywhere;
}

.skin-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<template>
    <v-container class="mb-4">
        <h2 class="skin-title">
            <back-link to="/skins" class="text-white">
                <v-icon icon="mdi-arrow-left" class="mx-2"/>
            </back-link>
            {{ skinNameDisplay }}
            <v-tooltip v-if="useRandomName" text="Random Name">
                <template v-slot:activator="{ props }">
                    <span v-bind="props">*</span>
                </template>
            </v-tooltip>
            <v-tooltip
                :text="skin?.visibility===SkinVisibility2.PRIVATE ? $t('Private') : skin?.visibility===SkinVisibility2.UNLISTED? $t('Unlisted') : $t('Public')">
                <template v-slot:activator="{ props }">
                    <span v-bind="props">
                        <v-icon class="mx-2">{{
                                skin?.visibility === SkinVisibility2.PRIVATE ? 'mdi-eye-off' : skin?.visibility === SkinVisibility2.UNLISTED ? 'mdi-link' : 'mdi-earth'
                            }}</v-icon>
                    </span>
                </template>
            </v-tooltip>
        </h2>
        <v-row class="mt-1">
            <v-col cols="12">
                <SkinSummaryCard :skin="skin" :skin-meta="skinMeta"/>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <ad-wrappper ad-slot="4431802313"/>
        </v-row>
        <!--        <dbg :data="skin"/>-->
        <v-row>
            <v-col cols="12">
                <SkinInstructionsCard :skin="skin"/>
            </v-col>
        </v-row>

        <v-row class="my-4">
            <v-col cols="12" md="6">
                <div class="text-grey-darken-2">Generated on {{ new Date(skin?.generator?.timestamp).toUTCString() }} in
                    {{ skin?.generator?.duration / 1000 }}s
                </div>
                <div class="text-grey-darken-3">By worker {{ skin?.generator?.worker || 'n/a' }} with account
                    {{ skin?.generator?.account?.substring(0, 10) || 'n/a' }} via server
                    {{ skin?.generator?.server || 'n/a' }}
                </div>
            </v-col>
            <v-col cols="12" md="6" class="text-end line-break-anywhere">
                <div class="text-grey-darken-2">
                    <span class="mx-1">
                        {{ skin?.uuid }}
                        <v-tooltip location="left" text="Skin ID" activator="parent" open-on-click/>
                    </span>
                    <CopyBtn
                        :text="skin?.uuid"
                        size="small"
                        tooltip-location="left"
                        content-key="skin_uuid"
                    />
                </div>
                <div class="text-grey-darken-3">
                    <span class="mx-1">
                        {{ skin?.texture?.hash?.skin }}
                        <v-tooltip location="left" text="Texture Hash" activator="parent" open-on-click/>
                    </span>
                    <CopyBtn
                        :text="skin?.texture?.hash?.skin"
                        size="small"
                        tooltip-location="left"
                        content-key="skin_texture_hash"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { useLazyAsyncData, useNuxtApp } from "#app";
import {
    type Maybe,
    type SkinIdAndTexture,
    type SkinInfo,
    type SkinInfo2,
    SkinVisibility2,
    type ValueAndSignature
} from "@mineskin/types";
import SkinSummaryCard from "~/components/skin/SkinSummaryCard.vue";
import SkinInstructionsCard from "~/components/skin/SkinInstructionsCard.vue";
import { skinName } from "../../util/skin";
import AdWrappper from "~/components/AdWrappper.vue";
import { renderSkinBody, renderSkinHead, renderSkinHeadIcon } from "~/util/render";
import type { SkinMeta } from "~/types/SkinMeta";

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});
const validSkinId = computed(() => {
    return skinId.value && (skinId.value.length === 32 || skinId.value.length === 36 || skinId.value.length === 8)
});

const {$mineskin, $notify, $gtag} = useNuxtApp();

const {
    data: skin,
    refresh: refreshSkin
} = useLazyAsyncData<Maybe<SkinInfo2>>(`skin-${ skinId.value }`, async () => {
    if (!validSkinId.value) return;
    return (await $mineskin.skins.get(skinId.value))?.skin;
}, {
    immediate: false
});

const {
    data: randomSkinName,
    refresh: refreshRandomSkinName
} = useLazyAsyncData<string>(`skin-rng-name-${ skin.value?.uuid || skinId.value }`, async () => {
    if (!validSkinId.value) return;
    return (await $mineskin.util.randomName(skin.value?.uuid || skinId.value));
}, {
    immediate: false
});

const {
    data: skinMeta,
    refresh: refreshSkinMeta
} = useLazyAsyncData<SkinMeta>(`skin-meta-${ skin.value?.uuid || skinId.value }`, async () => {
    return (await $mineskin.skins.getMeta(skin.value?.uuid || skinId.value))?.meta;
}, {
    immediate: false
});


const useRandomName = computed(() => {
    return !skin.value?.name && randomSkinName.value;
})

const skinNameDisplay = computed(() => {
    if (useRandomName.value) {
        return randomSkinName.value;
    }
    return skinName(skin.value, randomSkinName.value || 'Skin');
});

const skinHeadImage = computed(() => {
    if (!skin.value) return null;
    return renderSkinHead(skin.value.texture.hash.skin);
});
const skinHeadIcon = computed(() => {
    if (!skin.value) return null;
    return renderSkinHeadIcon(skin.value.texture.hash.skin);
});
const skinBodyImage = computed(() => {
    if (!skin.value) return null;
    return renderSkinBody(skin.value.texture.hash.skin);
});
const ogImage = computed(() => {
    return skinBodyImage.value || '/img/mineskin-social-card.jpg';
});

const imageAlt = computed(() => {
    return skinMeta?.value?.description || skinNameDisplay.value;
});

const description = computed(() => {
    let desc = '';
    if (skinMeta?.value?.description) {
        desc += skinMeta.value.description;
    } else {
        desc += `A Minecraft Skin`;
        if (skin.value?.name) {
            desc += ` named ${ skin.value.name }`;
        }
        if (skin.value?.tags && skin.value.tags.length > 0) {
            desc += ` with tags ${ skin.value.tags.map(t => t.tag.replace(/[^a-z]/ig, ' ')).join(', ') }`;
        }
    }
    desc += ' - generated'
    if (skin.value?.generator?.timestamp) {
        desc += ` on ${ new Date(skin.value.generator.timestamp).toLocaleDateString() }`;
    }
    desc += ' by MineSkin, a generator for Minecraft skin texture signatures.';
    return desc;
});

useSeoMeta({
    title: skinNameDisplay,
    ogTitle: skinNameDisplay,
    twitterTitle: skinNameDisplay,
    ogImage: ogImage,
    ogImageAlt: imageAlt,
    description: description,
    ogDescription: description,
    twitterDescription: description,
})

const ldJsonContent = computed(() => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": skinNameDisplay.value,
        "url": `https://mineskin.org/skins/${ skin.value?.uuid || skinId.value }`,
        "image": ogImage.value,
        "datePublished": new Date(skin.value?.generator?.timestamp || 0).toISOString(),
    });
});
const ldBreadcrumbContent = computed(() => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Gallery",
                "item": "https://mineskin.org/skins"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": skinNameDisplay.value,
                "item": `https://mineskin.org/skins/${ skin.value?.uuid || skinId.value }`,
            }
        ]
    })
})

useHead({
    link: [
        {
            rel: 'canonical',
            href: `https://mineskin.org/skins/${ skin.value?.uuid || skinId.value }`
        },
        {
            rel: 'icon',
            type: 'image/png',
            href: skinHeadIcon,
            id: 'skin-icon'
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            'data-ld-id': 'skin-webpage',
            innerHTML: ldJsonContent
        },
        {
            type: 'application/ld+json',
            'data-ld-id': 'skin-breadcrumb',
            innerHTML: ldBreadcrumbContent
        }
    ]
})

watch(skin, (skin) => {
    if (skin) {
        if (skinId.value !== skin.uuid) {
            router.replace(`/skins/${ skin.uuid }`);
        }
    }
    refreshRandomSkinName();
    refreshSkinMeta();
}, {
    immediate: true
})

onMounted(async () => {
    await refreshSkin();
    if (skinId.value) {
        if (skinId.value.length !== 32 && skinId.value.length !== 36 && skinId.value.length !== 8) {
            $notify({
                text: "Invalid skin ID",
                color: "error"
            })
        }
    }

    try {
        $gtag('event', 'view_skin')
    } catch (e) {
        console.error(e);
    }
})

</script>