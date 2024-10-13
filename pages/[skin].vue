<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <v-img
                    lazy-src="/img/questionhead.png"
                    :src="renderSkinBody(skin?.texture?.hash?.skin)"
                    aspect-ratio="1"
                />
                {{ skin?.uuid }}
            </v-col>
            <v-col>
                <v-row>
                    <copy-text-field
                        label="Direct Link"
                        readonly
                        :value="skinLink"
                    ></copy-text-field>
                </v-row>
                <v-row>
                    <copy-text-field
                        label="Skin Value"
                        readonly
                        :value="skinValue"
                    ></copy-text-field>
                </v-row>
                <v-row>
                    <copy-text-field
                        label="Skin Signature"
                        readonly
                        :value="skinSignature"
                    ></copy-text-field>
                </v-row>
                <v-row>
                    <copy-text-field
                        label="Texture URL"
                        readonly
                        :value="skinTextureUrl"
                    ></copy-text-field>
                </v-row>
            </v-col>
            {{ skin }}
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { useNuxt } from "@nuxt/kit";
import { useLazyAsyncData, useNuxtApp } from "#app";
import { renderSkinBody, renderSkinHead } from "~/util/render";

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

const {$mineskin} = useNuxtApp();

const {
    data: skin
} = useLazyAsyncData(`skin-${skinId.value}`, async () => {
    return (await $mineskin.skins.get(skinId.value))?.skin;
});

const skinLink = computed(()=>{
    return `https://minesk.in/${skinId.value}`;
});

const skinValue = computed(()=>{
    return skin.value.texture.data.value;
});

const skinSignature = computed(()=>{
    return skin.value.texture.data.signature;
});

const skinTextureUrl = computed(()=>{
    return skin.value.texture.url.skin;
});

</script>