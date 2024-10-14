<template>
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
</template>
<script setup lang="ts">
import { renderSkinBody } from "~/util/render";
import type { Maybe, SkinIdAndTexture, SkinInfo2, ValueAndSignature } from "@mineskin/types";
const props = defineProps<{
    skin: SkinInfo2;
}>();

const skinLink = computed(() => {
    return `https://minesk.in/${ props.skin.uuid }`;
});

const skinTexture = computed<Maybe<SkinIdAndTexture>>(() => props.skin.texture);
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
</script>