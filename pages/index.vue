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
    </v-container>
</template>
<script setup lang="ts">
import GeneratePanel from "~/components/GeneratePanel.vue";
</script>