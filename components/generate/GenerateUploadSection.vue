<template>
    <div class="text-center">
        <v-row justify="center" class="mb-2 flex-0-0">
            {{ $t("UPLOAD") }}
        </v-row>
        <v-row justify="center" align="center" class="my-2 flex-0-0">
            <v-sheet
                rounded
                border
                color="transparent"
                class="pa-2 ma-2 clickable"
                @click="showFilePicker()"
            >
                <v-icon size="64">
                    mdi-upload
                </v-icon>
            </v-sheet>
        </v-row>
        <FileList
            justify="center" class="text-center"
            v-model="uploadFiles"
            :label="$t('UPLOAD')"
            prepend-icon="mdi-file"
            :image-provider="file=>fileToUrl(file)"
            :waiting="generating"
        />
        <v-row class="flex-1-1-100" align="end">
            <v-col>
                {{ $t("Drag skin image files here to generate signatures for them") }}
            </v-col>
        </v-row>
        <!--        <v-row justify="center" align="center" class="my-2">-->
        <!--            <v-btn-->
        <!--                color="primary"-->
        <!--                icon="mdi-arrow-right"-->
        <!--                variant="elevated"-->
        <!--                aria-label="Continue"-->
        <!--                :disabled="!hasFile"-->
        <!--                @click="cont()"-->
        <!--            ></v-btn>-->
        <!--        </v-row>-->
    </div>
</template>
<script setup lang="ts">
import '~/assets/css/misc.css'
import { computed } from "vue";
import FileList from "./list/FileList.vue";
import type { FileJson } from "~/util/file";

const uploadFiles = defineModel<FileJson[]>({required: true});
const hasFile = computed(() => uploadFiles.value.length > 0);

const props = defineProps<{
    generating?: boolean
}>()

const emit = defineEmits(['pick']);

function fileToUrl(file: FileJson): string {
    if (!file || !file.size) return '';
    //return URL.createObjectURL(file);
    return file.data;
}

function showFilePicker() {
    emit('pick');
}

</script>