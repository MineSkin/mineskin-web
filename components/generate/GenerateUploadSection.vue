<template>
    <div class="text-center"    >
        <v-row justify="center" class="mb-2">
            UPLOAD
        </v-row>
        <v-row justify="center" align="center">
            <v-sheet
                rounded
                border
                color="transparent"
                class="pa-2 ma-4"
            >
                <v-icon size="128">
                    mdi-upload
                </v-icon>
            </v-sheet>
        </v-row>
        <FileList
            justify="center" class="text-center"
            v-model="uploadFiles"
            label="UPLOAD"
            prepend-icon="mdi-file"
            />
        <v-row justify="center" align="center">
            <v-btn
                color="primary"
                icon="mdi-arrow-right"
                variant="elevated"
                aria-label="Continue"
            ></v-btn>
        </v-row>
    </div>
</template>
<script setup lang="ts">
import FileList from "~/components/FileList.vue";

const uploadFiles = defineModel<File[]>([]);
</script>