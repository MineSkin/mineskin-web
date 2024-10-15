<style scoped>
.section-col {
    transition: max-width 1s;
}

.section-upload, .section-url, .section-user {
    min-height: 229px;
}
</style>
<template>
    <v-sheet
        rounded
        elevation="1"
        class="mx-auto px-4 pt-0 pb-4"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
        :color="dragging ? 'secondary' : ''"
    >
        <h3 class="text-h6 mb-2 pt-1">
            Generate New Skin Data
        </h3>
        <v-row class="my-2 d-flex text-center"
               :justify="generateType === GenerateType.UPLOAD ? 'center':generateType===GenerateType.USER?'end':'start'">
            <v-col
                :cols="!generateType ? 4:generateType === GenerateType.URL ? 6 : 'auto'"
                class="mx-4 section-col"
            >
                <GenerateUrlSection
                    class="section-url"
                    v-show="!generateType || generateType === GenerateType.URL"
                    v-model="urls"
                    @continue="cont"
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
                    @continue="cont"
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
                    @continue="cont"
                />
            </v-col>
        </v-row>
        <v-divider class="my-4"/>
        <v-expand-transition>
            <v-row v-show="generateType" class="my-2">
                <v-col>
                    <SimplePreview :user="users[0]" :url="urls[0]" :file="uploadFiles[0]"/>
                </v-col>
                <v-col class="text-center">
                    <v-btn
                        color="primary"
                        text="Generate"
                        size="x-large"
                        @click="cont"
                    ></v-btn>
                </v-col>
                <v-col>
                    <v-row class="mb-2">
                        <v-text-field
                            label="Name (optional)"
                            v-model="name"
                            hint="Optional name for this skin"
                            persistent-hint
                        />
                    </v-row>
                    <v-row class="mb-2">
                        <v-select
                            label="Visibility"
                            v-model="visibility"
                            :items="Object.values(SkinVisibility2)"
                            :item-props="visibilityProps"
                            hint="Visibility of the skin"
                            persistent-hint
                        />
                    </v-row>
                    <v-row class="mb-2">
                        <v-select
                            label="Variant"
                            v-model="variant"
                            :items="Object.values(SkinVariant)"
                            :item-props="variantProps"
                            hint="Variant of the skin. Use unknown for auto-detect"
                            persistent-hint
                        />
                    </v-row>
                </v-col>
            </v-row>
        </v-expand-transition>
        <v-row>
            <dbg :data="{users,uploadFiles,urls,generateType}"/>
        </v-row>
    </v-sheet>
</template>
<script setup lang="ts">

import { GenerateType, type Maybe, SkinVariant, SkinVisibility2 } from "@mineskin/types";
import GenerateUrlSection from "~/components/generate/GenerateUrlSection.vue";
import GenerateUploadSection from "~/components/generate/GenerateUploadSection.vue";
import { useQueueStore } from "~/stores/queue";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import SimplePreview from "~/components/SimplePreview.vue";

const {$mineskin} = useNuxtApp();

const queueStore = useQueueStore();

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

const name = ref('');
const visibility = ref(SkinVisibility2.PUBLIC);
const variant = ref(SkinVariant.UNKNOWN);

const dragging = ref(false);

function onDrop(e: DragEvent) {
    console.log(e)
    dragging.value = false;
    uploadFiles.value.push(...Array.from(e.dataTransfer.files));
}

function visibilityProps(item: SkinVisibility2) {
    switch (item) {
        case SkinVisibility2.PUBLIC:
            return {
                title: "Public",
                subtitle: "Visible to everyone"
            };
        case SkinVisibility2.UNLISTED:
            return {
                title: "Unlisted",
                subtitle: "Visible to anyone with the link"
            };
        case SkinVisibility2.PRIVATE:
            return {
                title: "Private",
                subtitle: "Visible to you only"
            };
    }
}

function variantProps(item: SkinVariant) {
    switch (item) {
        case SkinVariant.CLASSIC:
            return {
                title: "Classic",
                subtitle: "Classic skin"
            };
        case SkinVariant.SLIM:
            return {
                title: "Slim",
                subtitle: "Slim skin"
            };
        case SkinVariant.UNKNOWN:
            return {
                title: "Unknown",
                subtitle: "Auto-detect"
            };
    }
}

async function cont() {
    console.log('continue');
    switch (generateType.value) {
        case GenerateType.UPLOAD:
            const response = await $mineskin.queue.upload(uploadFiles.value[0], {
                visibility: visibility.value,
                variant: variant.value || undefined,
                name: name.value
            });
            if (response.success) {
                if ('job' in response) {
                    queueStore.addJob((response as GenerateJobResponse).job);
                }
            }
            break;
        case GenerateType.URL:
            break;
        case GenerateType.USER:
            break;
    }
}

</script>