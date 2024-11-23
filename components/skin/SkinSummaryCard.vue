<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4">
                    <v-img
                        :lazy-src="PLACEHOLDER_BODY"
                        :src="renderSkinBody(skin?.texture?.hash?.skin)"
                        aspect-ratio="1"
                    />
                </v-col>
                <v-divider :vertical="mdAndUp" class="my-4"/>
                <v-col>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                label="Direct Link"
                                readonly
                                :value="skinLink"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                label="Skin Value"
                                readonly
                                :value="skinValue"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                label="Skin Signature"
                                readonly
                                :value="skinSignature"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                label="Texture URL"
                                readonly
                                :value="skinTextureUrl"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="my-4"/>
                    <v-row>
                        <v-col v-if="!skin">
                            <v-skeleton-loader v-if="!skin" type="button,button"/>
                        </v-col>
                        <v-col v-else>
                            <v-btn
                                color="secondary"
                                text="Download Skin"
                                class="ma-2"
                                size="large"
                                :href="proxiedSkinTextureUrl"
                                download
                                prepend-icon="mdi-download"
                            ></v-btn>
                            <v-btn
                                color="accent"
                                text="Use This Skin"
                                class="ma-2"
                                size="large"
                                :href="useSkinLink"
                                prepend-icon="mdi-open-in-new"
                            ></v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-if="skin && tagsVisible">
                        <v-col>
                            <SkinTags :skin="skin"/>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import type { Maybe, SkinIdAndTexture, SkinInfo2, ValueAndSignature } from "@mineskin/types";
import CopyTextField from "./CopyTextField.vue";
import { computed } from "vue";
import { renderSkinBody } from "~/util/render";
import { PLACEHOLDER_BODY, PLACEHOLDER_HEAD } from "~/util/skin";
import SkinTags from "~/components/skin/SkinTags.vue";
const props = defineProps<{
    skin: SkinInfo2;
}>();

const {mdAndUp} = useDisplay();

const {$flags} = useNuxtApp();
const tagsVisible = computed(() => $flags.hasFeature('web.tags.visible'));

const skinLink = computed(() => {
    return `https://2.minesk.in/${ props.skin.uuid }`;
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

const proxiedSkinTextureUrl = computed(()=>{
    return `https://mineskin.org/textures/${ props.skin.texture.hash.skin }?attachment`;
})

//TODO: verify this actually still works
const useSkinLink = computed(()=>{
    return `https://www.minecraft.net/profile/skin/remote?url=${ skinTextureUrl.value }`;
})
</script>