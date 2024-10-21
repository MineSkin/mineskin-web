<template>
    <v-container class="mb-4">
        <v-row>
            <v-col cols="12">
                <h1>MineSkin</h1>
                <p>Automate Minecraft Skin Signature Generation</p>
            </v-col>
        </v-row>
        <v-row v-if="notificationBanner">
           <v-col>
               <v-card :color="notificationBanner.color||'warning'">
                   <v-card-title>{{ notificationBanner.title }}</v-card-title>
                   <v-card-text>{{ notificationBanner.text }}</v-card-text>
               </v-card>
           </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <LatestSkinsPreviewList/>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <!-- web v2 index middle banner -->
            <ad-wrappper ad-slot="3929622901"/>
        </v-row>
        <v-row>
            <v-col cols="12">
                <GeneratePanel/>
            </v-col>
        </v-row>
        <v-btn @click="testNotify()">Notify Test</v-btn>
<!--        <JobList/> &lt;!&ndash;TODO: move&ndash;&gt;-->
<!--        <dbg :data="authStore.user"/>-->
<!--        <CreditsInfo/> &lt;!&ndash;TODO: move&ndash;&gt;-->
        <v-row class="my-10">
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { useNuxtApp, useState } from "#app";
import AdWrappper from "~/components/AdWrappper.vue";
import { useAuthStore } from "~/stores/auth";
import LatestSkinsPreviewList from "~/components/skin/LatestSkinsPreviewList.vue";

const {$notify,$flags} = useNuxtApp();

const authStore = useAuthStore();

const {mdAndUp} = useDisplay();

const notificationBanner = computed(() => {
    if ($flags.hasFeature('web.notification_banner')) {
        return JSON.parse($flags.getValue('web.notification_banner'));
    }
    return undefined;
})


function testNotify() {
    $notify({
        text: 'Hello World\n\nTest',
        color: 'success',
        timeout: 20000
    });
}
</script>