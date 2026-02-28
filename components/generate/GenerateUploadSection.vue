<style scoped>
.generate-gradient-border {
    position: relative;
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 8px;
    z-index: auto;
}

.generate-gradient-border:before {
    content: "";
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    z-index: -1;
    background-image: linear-gradient(
        45deg,
        rgb(var(--v-theme-mskindigo)),
        rgb(var(--v-theme-secondary))
    );
    border-radius: 8px;
}
</style>
<template>
    <div class="text-center">
        <v-row justify="center" class="mb-2 flex-0-0">
            {{ $t("UPLOAD") }}
        </v-row>
        <v-row justify="center" align="center" class="my-2 flex-0-0" style="z-index:0;">
            <v-sheet
                rounded
                border
                class="pa-2 ma-2 clickable generate-gradient-border"
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