<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4" class="d-flex flex-column">
                    <v-row class="flex-1-1-100 my-2">
                        <v-img
                            :lazy-src="PLACEHOLDER_BODY"
                            :src="renderSkinBody(skin?.texture?.hash?.skin)"
                            aspect-ratio="1"
                        />
                    </v-row>
                    <v-row justify="end" v-if="mdAndUp">
                        <v-col class="text-end">
                            <div class="text-grey-darken-2 mt-2" v-if="skin?.shortId">
                                <span class="mx-1">
                                    {{ skin?.shortId }}
                                    <v-tooltip location="left" text="Short Skin ID" activator="parent" open-on-click/>
                                </span>
                                <CopyBtn
                                    :text="skin?.uuid"
                                    tooltip-location="left"
                                    content-key="skin_summary_short_id"
                                />
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <v-divider :vertical="mdAndUp" class="my-4"/>
                <v-col cols="12" md="8">
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                location="append"
                                :label="$t('Direct Link')"
                                readonly
                                content-key="skin_link"
                                :value="skinLink"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                location="append"
                                :label="$t('Skin Value')"
                                readonly
                                content-key="skin_value"
                                :value="skinValue"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                location="append"
                                :label="$t('Skin Signature')"
                                readonly
                                content_key="skin_signature"
                                :value="skinSignature"
                            ></copy-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-skeleton-loader v-if="!skin" type="text" width="100%"/>
                            <copy-text-field
                                v-else
                                location="append"
                                :label="$t('Texture URL')"
                                readonly
                                content-key="skin_texture_url"
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
                                :text="$t('Download Skin')"
                                class="ma-2"
                                size="large"
                                :href="proxiedSkinTextureUrl"
                                download
                                prepend-icon="mdi-download"
                                @click="downloadSkin"
                            ></v-btn>
                            <!--                            <v-btn-->
                            <!--                                color="accent"-->
                            <!--                                text="Use This Skin"-->
                            <!--                                class="ma-2"-->
                            <!--                                size="large"-->
                            <!--                                :href="useSkinLink"-->
                            <!--                                prepend-icon="mdi-open-in-new"-->
                            <!--                            ></v-btn>-->
                        </v-col>
                        <v-col cols="12" md="3" v-if="reportVisible" align-self="end" class="text-end">
                            <SkinReportDialog :skin="skin"/>
                        </v-col>
                        <InvisibleTurnstile v-if="skin" v-model:token="viewTurnstileToken" action="view-skin"/>
                    </v-row>
                    <v-row v-if="skin">
                        <v-col v-if="tagsVisible">
                            <span class="text-medium-emphasis">
                                <span v-if="authed">
                                    Tags
                                </span>
                                <span v-else>
                                    Sign in to add tags
                                </span>
                            </span>
                            <SkinTags class="mt-1" :skin="skin"/>
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
import InvisibleTurnstile from "~/components/InvisibleTurnstile.vue";
import { useInteractionsStore } from "~/stores/interactions";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const props = defineProps<{
    skin: SkinInfo2;
}>();

const {mdAndUp} = useDisplay();

const {$flags, $mineskin, $gtag} = useNuxtApp();

const tagsVisible = computed(() => $flags.hasFeature('web.tags.visible'));
const reportVisible = computed(() => $flags.hasFeature('web.report.visible'));

const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);

const interactionsStore = useInteractionsStore();
const {recentViews} = storeToRefs(interactionsStore);

const skinLink = computed(() => {
    return `https://minesk.in/${ /*props.skin.shortId ||*/ props.skin.uuid }`;
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

const proxiedSkinTextureUrl = computed(() => {
    return `https://mineskin.org/textures/${ props.skin.texture.hash.skin }?attachment`;
})

//TODO: verify this actually still works
const useSkinLink = computed(() => {
    return `https://www.minecraft.net/profile/skin/remote?url=${ skinTextureUrl.value }`;
});

const viewTurnstileToken: Ref<string | null> = ref(null);
watch(viewTurnstileToken, async (token) => {
    if (!token) return;
    if (recentViews.value.includes(props.skin.uuid)) return;
    recentViews.value.push(props.skin.uuid);
    if (recentViews.value.length > 10) {
        recentViews.value.shift();
    }
    await $mineskin.skins.trackView(props.skin.uuid, token);
});

const downloadSkin = () => {
    try {
        $gtag('event', 'download_skin')
    } catch (e) {
        console.error(e);
    }
}

const reportSkin = () => {
    //TODO
}


</script>