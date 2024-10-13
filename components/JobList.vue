<template>
    <v-list>
        <v-list-item  v-for="item in queueStore.jobIds">
            {{ item }}
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";

const queueStore = useQueueStore();
</script>