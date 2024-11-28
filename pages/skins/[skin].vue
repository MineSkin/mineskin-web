<style>
.line-break-anywhere {
    line-break: anywhere;
}
</style>
<template>
    <v-container class="mb-4">
        <h2>
            <back-link to="/gallery" class="text-white">
                <v-icon icon="mdi-arrow-left" class="mx-2"/>
            </back-link>
            {{ skinNameDisplay }}
            <v-tooltip v-if="useRandomName" text="Random Name">
                <template v-slot:activator="{ props }">
                    <span v-bind="props">*</span>
                </template>
            </v-tooltip>
            <v-tooltip
                :text="skin?.visibility===SkinVisibility2.PRIVATE ? 'Private' : skin?.visibility===SkinVisibility2.UNLISTED? 'Unlisted':'Public'">
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
                <SkinSummaryCard :skin="skin"/>
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
                <div class="text-grey-darken-3">{{ skin?.texture?.hash?.skin }}</div>
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
import { renderSkinBody, renderSkinHead } from "~/util/render";

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

const {$mineskin} = useNuxtApp();

const {
    data: skin
} = useLazyAsyncData<Maybe<SkinInfo2>>(`skin-${ skinId.value }`, async () => {
    return (await $mineskin.skins.get(skinId.value))?.skin;
});

const {
    data: randomSkinName,
    refresh: refreshRandomSkinName
} = useLazyAsyncData<string>(`skin-rng-name-${ skin.value?.uuid || skinId.value }`, async () => {
    return (await $mineskin.util.randomName(skin.value?.uuid || skinId.value));
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
// const skinBodyImage = computed(() => {
//     if (!skin.value) return null;
//     return renderSkinBody(skin.value.texture.hash.skin);
// });
const ogImage = computed(() => {
    return skinHeadImage.value || '/img/mineskin-social-card.jpg';
});

useSeoMeta({
    title: skinNameDisplay,
    ogTitle: skinNameDisplay,
    ogImage: ogImage
})

const ldJsonContent = computed(() => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": skinNameDisplay.value,
        "url": `https://beta.mineskin.org/skins/${ skin.value?.uuid || skinId.value }`,
        "image": ogImage.value,
        "datePublished": new Date(skin.value?.generator?.timestamp || 0).toISOString(),
    });
});

useHead({
    link: [{
        rel: 'canonical',
        href: `https://beta.mineskin.org/skins/${ skin.value?.uuid || skinId.value }`
    }],
    script: [{
        type: 'application/ld+json',
        innerHTML: ldJsonContent
    }]
})

watch(skin, (skin) => {
    if (skin) {
        $mineskin.skins.trackView(skin.uuid);
        if (skinId.value !== skin.uuid) {
            router.replace(`/skins/${ skin.uuid }`);
        }
    }
    refreshRandomSkinName();
}, {
    immediate: true
})

onMounted(() => {
})

</script>