<template>
    <v-container class="mb-4">
        <v-row>
            <v-col cols="12">
                <h1>MineSkin</h1>
                <p>{{ $t("Automate Minecraft Skin Signature Generation") }}</p>
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
            <ad-info-wrapper>
                <template #default>
                    <!-- web v2 index middle banner -->
                    <ad-wrappper ad-slot="3929622901"/>
                </template>
            </ad-info-wrapper>
        </v-row>
        <v-row class="mb-2">
            <v-col cols="12">
                <GeneratePanel/>
            </v-col>
        </v-row>

        <v-divider class="my-4"/>

        <v-row justify="center" class="my-4">
            <v-col cols="12" md="8">
                <MainFAQ class="mb-2"/>
                <!-- web v2 faq banner -->
                <!--                <ad-wrappper ad-slot="8238741844"/>-->
            </v-col>
            <v-col cols="12" md="4" xl="3">
                <h4 class="text-h5 mb-4">Stats</h4>
                <StatsPanel/>
            </v-col>
        </v-row>
        <!--        <v-btn @click="testNotify()">Notify Test</v-btn>-->
        <!--        <JobList/> &lt;!&ndash;TODO: move&ndash;&gt;-->
        <!--        <dbg :data="authStore.user"/>-->
        <!--        <CreditsInfo/> &lt;!&ndash;TODO: move&ndash;&gt;-->
        <v-row class="my-10">
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { useNuxtApp, useState } from "#app";
import AdWrappper from "~/components/ad/AdWrappper.vue";
import LatestSkinsPreviewList from "~/components/skin/LatestSkinsPreviewList.vue";
import MainFAQ from "~/components/MainFAQ.vue";
import AdInfoWrapper from "~/components/ad/AdInfoWrapper.vue";

const {$notify, $flags} = useNuxtApp();

const notificationBanner = computed(() => {
    if ($flags.hasFeature('web.notification_banner')) {
        return JSON.parse($flags.getValue('web.notification_banner'));
    }
    return undefined;
})
</script>