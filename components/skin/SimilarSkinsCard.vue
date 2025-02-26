<template>
    <v-sheet rounded elevation="1" class="mx-auto px-4 pt-0 pb-4"
             v-show="isHydrated && similarSkins && similarSkins?.length>2">
        <h3 class="text-h6 mb-2 pt-1">
            <span class="d-inline-block pt-2">{{ $t("Similar Skins") }}</span>
        </h3>
        <v-row class="skin-single-row">
            <v-slide-group>
                <skin-link-img class="ma-2" v-show="isHydrated && similarSkins" v-for="skin in similarSkins"
                               :key="skin.uuid" :skin="skin"/>
                <skin-link-img class="ma-2" v-show="!isHydrated || !similarSkins" v-for="n in 16" :key="n"/>
            </v-slide-group>
        </v-row>
        <!--        <dbg :data="latestSkins"/>-->
    </v-sheet>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { useLazyAsyncData, useNuxtApp } from "nuxt/app";
import { onMounted } from "#imports";

const localePath = useLocalePath();
const {$mineskin} = useNuxtApp();

const isHydrated = ref(false);

const props = defineProps<{
    skin: SkinInfo2;
}>();

const model = defineModel<boolean>();

const {
    data: similarSkins,
    status: similarSkinsStatus,
    refresh: refreshSimilarSkins
} = useLazyAsyncData(async () => {
    return (await $mineskin.skins.listSimilar(props.skin.uuid))?.skins?.slice(0, 8) || [];
}, {
    immediate: false
});

onMounted(async () => {
    isHydrated.value = true;
    await refreshSimilarSkins();
    model.value = true;
})


</script>