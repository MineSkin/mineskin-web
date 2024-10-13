<template>
    <v-sheet
        rounded
        elevation="1"
        class="mx-auto pa-4 text-center"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
        :color="dragging ? 'primary' : ''"
    >
        <v-row class="my-2 d-flex">
            <GenerateUrlSection
                v-model="urls"
            />
            <v-divider vertical/>
            <GenerateUploadSection/>
            <v-divider vertical/>
            <GenerateUserSection
                v-model="users"
            />
        </v-row>
        <v-row>
            <dbg :data="{users,uploadFiles,urls,generateType}"/>
        </v-row>
    </v-sheet>
</template>
<script setup lang="ts">

import { GenerateType, type Maybe } from "@mineskin/types";
import GenerateUrlSection from "~/components/generate/GenerateUrlSection.vue";
import GenerateUploadSection from "~/components/generate/GenerateUploadSection.vue";

const generateType = computed<Maybe<GenerateType>>(() => {
    if (urls.value.filter(url => url.length > 0).length > 0) {
        return GenerateType.URL;
    }
    if (users.value.filter(user => user.length > 0).length > 0) {
        return GenerateType.USER;
    }
    if (uploadFiles.value.length > 0) {
        return GenerateType.UPLOAD;
    }
});
const uploadFiles = ref<File[]>([]);

const urls = ref<string[]>(['']);
const users = ref<string[]>(['']);

const dragging = ref(false);

function onDrop(e: DragEvent) {
    console.log(e)
    dragging.value = false;
    uploadFiles.value.push(...Array.from(e.dataTransfer.files));
}

</script>