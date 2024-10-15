<template>
    <div class="text-center"    >
        <v-row justify="center" class="mb-2 flex-0-0">
            UPLOAD
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
            label="UPLOAD"
            prepend-icon="mdi-file"
            :image-provider="file=>fileToUrl(file)"
            />
        <v-row class="flex-1-1-100" align="end">
            <v-col>
                Drag a skin image file here to generate data for it
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
import FileList from "~/components/FileList.vue";

const uploadFiles = defineModel<File[]>([]);
const hasFile = computed(() => uploadFiles.value.length > 0);

const emit = defineEmits(['pick']);

function fileToUrl(file: File): string {
    return URL.createObjectURL(file);
}

function showFilePicker() {
    emit('pick');
}

</script>