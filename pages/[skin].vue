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

        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-tabs
                        v-model="instructionsTab"
                    >
                        <v-tab value="vanilla">Vanilla</v-tab>
                        <v-tab value="code">Code</v-tab>
                        <v-tab value="plugins">Plugins/Mods</v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-tabs-window v-model="instructionsTab">
                            <v-tabs-window-item value="vanilla">
                                One
                            </v-tabs-window-item>

                            <v-tabs-window-item value="code">
                                Two
                            </v-tabs-window-item>

                            <v-tabs-window-item value="plugins">
                                Three
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { useLazyAsyncData, useNuxtApp } from "#app";
import { renderSkinBody, renderSkinHead } from "~/util/render";
import type { Maybe, SkinIdAndTexture, SkinInfo, SkinInfo2, ValueAndSignature } from "@mineskin/types";

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

const {$mineskin} = useNuxtApp();

const {
    data: skin
} = useLazyAsyncData <Maybe<SkinInfo2>>(`skin-${ skinId.value }`, async () => {
    return (await $mineskin.skins.get(skinId.value))?.skin;
});

const skinLink = computed(() => {
    return `https://minesk.in/${ skinId.value }`;
});

const skinTexture = computed<Maybe<SkinIdAndTexture>>(() => skin.value?.texture);
const skinTextureData = computed<Maybe<ValueAndSignature>>(() => skinTexture.value?.data);

const skinValue = computed(() => {
    return skinTextureData.value?.value;
});

const skinSignature = computed(() => {
    return skinTextureData.value?.signature;
});

const skinTextureUrl = computed(() => {
    return skinTexture.value?.url.skin;
});

const instructionsTab = ref('vanilla');

</script>