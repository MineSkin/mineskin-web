<template>
    <v-list>
        <JobStatus v-for="job in queueStore.jobs" :job="job"/>
        <v-list-item v-if="queueStore.jobs.length<=0">
            <v-list-item-title>No jobs in queue</v-list-item-title>
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";

const queueStore = useQueueStore();

const {$mineskin} = useNuxtApp();

onMounted(() => {
    queueStore.refreshJobList();
})


</script>