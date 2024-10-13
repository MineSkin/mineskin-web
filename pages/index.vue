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
        <v-row>
            <v-col cols="12">
                <GeneratePanel/>
            </v-col>
        </v-row>
<!--        <v-btn @click="testNotify()">Notify Test</v-btn>-->
    </v-container>
</template>
<script setup lang="ts">
import GeneratePanel from "~/components/GeneratePanel.vue";
// import { useNuxtApp } from "#app";

// const {$notify} = useNuxtApp();
//
// function testNotify() {
//     $notify({
//         text: 'Hello World',
//         color: 'success'
//     });
// }
</script>