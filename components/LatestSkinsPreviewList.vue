<style scoped>
.skin-single-row{
    flex-wrap: nowrap;
    overflow: hidden;
}
</style>
<template>
    <v-sheet rounded elevation="1" class="mx-auto px-4 pt-0 pb-4">
        <h3 class="text-h6 mb-2 pt-1">
            Latest Skins
            <v-btn icon="mdi-arrow-right" variant="text" to="/gallery"></v-btn>
        </h3>
        <v-row  class="skin-single-row">
<!--            <v-col cols="3" md="2" v-for="skin in latestSkins" :key="skin.uuid">-->
                <skin-link-img class="ma-2" v-for="skin in latestSkins" :key="skin.uuid" :skin="skin"/>
<!--            </v-col>-->
<!--            <v-col cols="2" md="2" v-for="n in 6" :key="n">-->
                <skin-link-img class="ma-2"  v-for="n in 6" :key="n"/>
<!--            </v-col>-->
        </v-row>
<!--        <dbg :data="latestSkins"/>-->
    </v-sheet>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";

const {$mineskin} = useNuxtApp();

const {
    data: latestSkins,
    status: latestSkinsStatus,
} = useLazyAsyncData(async () => {
    return (await $mineskin.skins.list())?.skins?.slice(0,8)||[];
});
</script>