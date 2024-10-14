<template>
    <v-list>
        <JobStatus v-for="job in queueStore.jobs" :job="job">
        </JobStatus>
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";

const queueStore = useQueueStore();

const {$mineskin} = useNuxtApp();

onMounted(()=>{
    queueStore.refreshJobList();
})


</script>