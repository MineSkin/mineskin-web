<style scoped>
.skin-single-row{
    flex-wrap: nowrap;
    overflow: hidden;
}
</style>
<template>
    <v-sheet rounded elevation="1" class="mx-auto px-4 pt-0 pb-4">
        <h3 class="text-h6 mb-2 pt-1">
            <span class="d-inline-block pt-2">{{ $t("Latest Skins") }}</span>
            <v-btn icon="mdi-arrow-right" variant="text" :to="localePath('/skins')"></v-btn>
        </h3>
        <v-row  class="skin-single-row">
            <v-slide-group>
                <skin-link-img class="ma-2" v-show="isHydrated && latestSkins" v-for="skin in latestSkins" :key="skin.uuid" :skin="skin"/>
                <skin-link-img class="ma-2" v-show="!isHydrated || !latestSkins" v-for="n in 16" :key="n"/>
            </v-slide-group>
        </v-row>
<!--        <dbg :data="latestSkins"/>-->
    </v-sheet>
</template>
<script setup lang="ts">

import { useLazyAsyncData, useNuxtApp } from "nuxt/app";
import { onMounted } from "#imports";

const localePath = useLocalePath();
const {$mineskin} = useNuxtApp();

const isHydrated = ref(false);

const {
    data: latestSkins,
    status: latestSkinsStatus,
    refresh: refreshLatestSkins
} = useLazyAsyncData(async () => {
    return (await $mineskin.skins.list())?.skins?.slice(0,16)||[];
},{
    immediate: false
});

onMounted(() => {
    isHydrated.value = true;
})
</script>