<template>
    <v-container>
        <h1>{{ skin?.name || skin?.uuid.substring(0, 8) || 'Skin' }}</h1>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-img
                                    lazy-src="/img/questionhead.png"
                                    :src="renderSkinBody(skin?.texture?.hash?.skin)"
                                    aspect-ratio="1"
                                />
                            </v-col>
                            <v-divider vertical class="my-4"/>
                            <v-col>
                                <v-row dense>
                                    <v-col>
                                        <copy-text-field
                                            label="Direct Link"
                                            readonly
                                            :value="skinLink"
                                        ></copy-text-field>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <copy-text-field
                                            label="Skin Value"
                                            readonly
                                            :value="skinValue"
                                        ></copy-text-field>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <copy-text-field
                                            label="Skin Signature"
                                            readonly
                                            :value="skinSignature"
                                        ></copy-text-field>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <copy-text-field
                                            label="Texture URL"
                                            readonly
                                            :value="skinTextureUrl"
                                        ></copy-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <dbg :data="skin"/>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-tabs
                        bg-color="secondary"
                        v-model="instructionsTab"
                    >
                        <v-tab value="vanilla">Vanilla</v-tab>
                        <v-tab value="code">Code</v-tab>
                        <v-tab value="plugins">Plugins/Mods</v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-tabs-window v-model="instructionsTab">
                            <v-tabs-window-item value="vanilla">
                                <div>
                                    <VanillaInstructions :skin="skin"/>
                                </div>
                            </v-tabs-window-item>

                            <v-tabs-window-item value="code">
                                <div>
                                    <SkinCodeInstructions :skin="skin"/>
                                </div>
                            </v-tabs-window-item>

                            <v-tabs-window-item value="plugins">
                                <div>
                                    <PluginInstructions :skin="skin"/>
                                </div>
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
import VanillaCommand16 from "~/components/instructions/VanillaCommand16.vue";
import VanillaCommand from "~/components/instructions/VanillaCommand.vue";
import VanillaInstructions from "~/components/instructions/VanillaInstructions.vue";
import SkinCodeInstructions from "~/components/instructions/SkinCodeInstructions.vue";
import PluginInstructions from "~/components/instructions/PluginInstructions.vue";

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