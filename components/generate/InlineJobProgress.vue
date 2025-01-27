<template>
    <div v-if="job||waiting">
<!--        <dbg :data="{originalName,job}"></dbg>-->
        <JobProgressBar :job="job" :waiting="waiting" height="8" hide-text/>
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
const {jobMap} = storeToRefs(queueStore);

const job = computed(() => Object.values(jobMap.value).find(job => job.originalName === props.originalName));

</script>