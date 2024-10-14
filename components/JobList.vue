<template>
    <v-list>
        <v-list-item  v-for="job in jobs">
            {{ job.id }}
            {{ job.status }}
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";
import { JobInfo } from "@mineskin/types";

const queueStore = useQueueStore();

const {$mineskin} = useNuxtApp();

const {
    data: jobs,
    status: jobsStatus,
} = await useLazyFetch<JobInfo[]>(async () => {
    return (await $mineskin.queue.list()).jobs;
});

</script>