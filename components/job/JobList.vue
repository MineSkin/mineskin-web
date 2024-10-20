<template>
    <v-list>
        <v-list-subheader>Jobs</v-list-subheader>
        <JobStatus v-for="job in jobs" :id="job.id" :key="job.id"/>
        <v-list-item v-if="jobs.length<=0">
            <v-list-item-title>No jobs in queue</v-list-item-title>
        </v-list-item>
<!--        <dbg :data="queueStore.jobMap"></dbg>-->
<!--        <dbg :data="queueStore.jobsSorted.map(j=>j.timestamp)"></dbg>-->
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";

const queueStore = useQueueStore();

const {$mineskin} = useNuxtApp();

const jobs = computed(() => queueStore.jobsSorted);

onMounted(() => {
    queueStore.refreshJobList();
})


</script>