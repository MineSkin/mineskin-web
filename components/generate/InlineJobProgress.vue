<template>
    <div v-if="job||waiting">
<!--        <dbg :data="{originalName,job}"></dbg>-->
        <v-progress-linear
            v-if="(waiting&&!job)||(job && job.status === 'waiting')"
            height="20"
            indeterminate
            color="primary">
            <template v-slot:default>
                {{ $t("Waiting") }}
            </template>
        </v-progress-linear>
        <v-progress-linear
            v-else-if="job && job.status === 'processing'"
            height="20"
            indeterminate
            color="warning">
            <template v-slot:default>
                {{ $t("Processing") }}
            </template>
        </v-progress-linear>
        <v-progress-linear
            v-else-if="job &&( job.status === 'completed'||job.status === 'failed')"
            height="20"
            model-value="100"
            :color="job.status === 'completed' ? 'success':'error'">
            <template v-slot:default>
                {{ job.status === 'completed' ? $t('Completed') : $t('Failed') }}
            </template>
        </v-progress-linear>
    </div>
</template>
<script setup lang="ts">
import type { JobInfo, Maybe, SkinInfo2 } from "@mineskin/types";
import { computedAsync } from "@vueuse/core";
import { useLazyAsyncData } from "#app";
import { useQueueStore } from "~/stores/queue";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import type { JobResponse } from "~/types/JobResponse";
import DateUTC from "~/components/DateUTC.vue";
import DateLocal from "~/components/DateLocal.vue";
import { sleep } from "~/util/misc";
import { storeToRefs } from "pinia";
import type { JobWithMeta } from "~/types/JobWithMeta";

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    originalName: string,
    waiting?: boolean
}>();

const localePath = useLocalePath()
const queueStore = useQueueStore();
const {jobMap} = storeToRefs(queueStore);

const job = computed(() => Object.values(jobMap.value).find(job => job.originalName === props.originalName));

// const {
//     data: jobRes,
//     refresh: refreshJob
// } = useLazyAsyncData<JobResponse>(`job-res-${ id.value }`, async () => {
//     return (await $mineskin.queue.get(id.value, {silent: true}));
// }, {
//     default: () => {
//         return {job: jobMap.value[id.value]}
//     }
// });

// const job = computed<JobInfo>(() => id.value && jobRes.value?.job);
//const skin = computed(() => jobRes.value?.skin);
</script>