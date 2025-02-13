<template>
    <div v-if="(wrappedJob&&wrappedJob?.job)||waiting">
        <JobProgressBar :job="wrappedJob?.job" :waiting="waiting" height="8" hide-text/>
    </div>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    originalName: string,
    waiting?: boolean
}>();

const localePath = useLocalePath()
const queueStore = useQueueStore();
const {wrappedJobMap} = storeToRefs(queueStore);

const wrappedJob = computed(() => Object.values(wrappedJobMap.value).find(job => job.source.name === props.originalName));

</script>