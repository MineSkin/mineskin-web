<template>
    <v-list>
        <v-list-subheader>Jobs</v-list-subheader>
        <JobStatus v-for="job in jobsSorted" :id="job.id" :key="job.id"/>
        <v-list-item v-if="jobsSorted.length<=0">
            <v-list-item-title>No jobs in queue</v-list-item-title>
        </v-list-item>
<!--        <dbg :data="queueStore.jobMap"></dbg>-->
<!--        <dbg :data="queueStore.jobsSorted.map(j=>j.timestamp)"></dbg>-->
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";

const queueStore = useQueueStore();
const authStore = useAuthStore();

const {jobsSorted} = storeToRefs(queueStore);

const {$mineskin} = useNuxtApp();

onMounted(async () => {
    await authStore.checkAuth();
    await queueStore.refreshJobList();
})


</script>