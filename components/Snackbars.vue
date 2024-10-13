<template>
    <v-snackbar-queue
        v-model="queue" :color="color" :timeout="timeout"
        closable
        location="top right"
        position="fixed"
    ></v-snackbar-queue>
</template>

<script setup lang="ts">
import {useState} from "#app";
import type { SnackbarConfig } from "~/types/SnackbarConfig";

const queue = useState<Array<SnackbarConfig>>('snackbars', () => ([]));

const timeout = ref(5000);
const color = ref("success");

onMounted(()=>{
})
</script>
