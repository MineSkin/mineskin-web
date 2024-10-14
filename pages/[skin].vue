<template>
    <v-container>
        <h2>
            <router-link to="/gallery" class="text-white">
                <v-icon icon="mdi-arrow-left" class="mx-2"/>
            </router-link>
            {{ skinName(skin) || 'Skin' }}
        </h2>
        <v-row class="mt-1">
            <v-col cols="12">
                <SkinSummaryCard :skin="skin"/>
            </v-col>
        </v-row>
        <!--        <dbg :data="skin"/>-->
        <v-row>
            <v-col cols="12">
                <SkinInstructionsCard :skin="skin"/>
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

</script>