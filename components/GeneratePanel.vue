<style scoped>
.section-col {
    transition: max-width 1s;
}

.section-upload, .section-url, .section-user {
}
</style>
<template>
    <v-sheet
        rounded
        elevation="1"
        class="mx-auto pa-4 text-center"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
        :color="dragging ? 'secondary' : ''"
    >
        <v-row class="my-2 d-flex" :justify="generateType === GenerateType.UPLOAD ? 'center':generateType===GenerateType.USER?'end':'start'">
            <v-col
                :cols="!generateType ? 4:generateType === GenerateType.URL ? 6 : 'auto'"
                class="mx-4 section-col"
            >
                <GenerateUrlSection
                    class="section-url"
                    v-show="!generateType || generateType === GenerateType.URL"
                    v-model="urls"
                />
            </v-col>
            <v-divider vertical v-show="!generateType"/>
            <v-col
                class="mx-4 section-col"
                :cols="!generateType?'':generateType === GenerateType.UPLOAD ? 4 : 4"
            >
                <GenerateUploadSection
                    class="section-upload"
                    v-show="!generateType || generateType === GenerateType.UPLOAD"
                    v-model="uploadFiles"
                />
            </v-col>
            <v-divider vertical v-show="!generateType"/>
            <v-col
                :cols="!generateType ? 4 : generateType === GenerateType.USER ? 6 : 'auto'"
                class="mx-4 section-col"
            >
                <GenerateUserSection
                    class="section-user"
                    v-show="!generateType || generateType === GenerateType.USER"
                    v-model="users"
                />
            </v-col>
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