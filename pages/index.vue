<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>MineSkin</h1>
                <p>Lorem Ipsum...</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <LatestSkinsPreviewList/>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <ad-wrappper ad-slot="3929622901"/>
        </v-row>
        <v-row>
            <v-col cols="12">
                <GeneratePanel/>
            </v-col>
        </v-row>
        <v-btn @click="testNotify()">Notify Test</v-btn>
        <JobList/> <!--TODO: move-->
        <dbg :data="authStore.user"/>
    </v-container>
</template>
<script setup lang="ts">
import { useNuxtApp, useState } from "#app";
import AdWrappper from "~/components/AdWrappper.vue";
import { useAuthStore } from "~/stores/auth";
import LatestSkinsPreviewList from "~/components/skin/LatestSkinsPreviewList.vue";

const {$notify} = useNuxtApp();

const authStore = useAuthStore();


function testNotify() {
    $notify({
        text: 'Hello World',
        color: 'success',
        timeout: 1000
    });
}
</script>