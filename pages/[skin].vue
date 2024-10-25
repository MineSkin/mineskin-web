<style>
.line-break-anywhere {
 line-break: anywhere;
}
</style>
<template>
    <v-container class="mb-4">
        <h2>
            <back-link  to="/gallery" class="text-white">
                <v-icon icon="mdi-arrow-left" class="mx-2"/>
            </back-link>
            {{ skinNameDisplay }}
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
                <div class="text-grey-darken-3">By worker {{ skin?.generator?.worker }} with account
                    {{ skin?.generator?.account?.substring(0, 10) }} via server {{ skin?.generator?.server }}
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
import type { Maybe, SkinIdAndTexture, SkinInfo, SkinInfo2, ValueAndSignature } from "@mineskin/types";
import SkinSummaryCard from "~/components/skin/SkinSummaryCard.vue";
import SkinInstructionsCard from "~/components/skin/SkinInstructionsCard.vue";
import { skinName } from "../util/skin";
import AdWrappper from "~/components/AdWrappper.vue";

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

const {$mineskin} = useNuxtApp();

const skinNameDisplay = computed(() => {
    return skinName(skin.value) || 'Skin';
});

const {
    data: skin
} = useLazyAsyncData<Maybe<SkinInfo2>>(`skin-${ skinId.value }`, async () => {
    return (await $mineskin.skins.get(skinId.value))?.skin;
});

useHead({
    title: skinNameDisplay
});

</script>