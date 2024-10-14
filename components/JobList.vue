<template>
    <v-list>
        <v-list-item  v-for="job in queueStore.jobs">
            {{ job.id }}
            {{ job.status }}
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";

const queueStore = useQueueStore();

const {$mineskin} = useNuxtApp();

onMounted(()=>{
    queueStore.refreshJobList();

    setInterval(() => {
        queueStore.updatePendingJobs();
    }, 1000);
})


</script>