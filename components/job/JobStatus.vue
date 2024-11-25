<template>
    <div v-if="id  &&job">
        <v-list-item>
            <template v-slot:prepend>
                <div class="mr-2" style="width: 48px">
                    <SkinHeadImg :texture="jobTexture"></SkinHeadImg>
                </div>
            </template>
            <template v-slot:title>
                <nuxt-link v-if="skin" :to="'/skins/'+skin.uuid" class="text-decoration-none">{{
                        job.id?.substring(0, 8)
                    }}
                </nuxt-link>
                <span v-else>{{ job.id?.substring(0, 8) }}</span>
            </template>
            <template v-slot:subtitle>
                <DateLocal class="float-end" :date="job.timestamp"></DateLocal>
            </template>
            <v-progress-linear
                v-if="job.status === 'waiting'"
                height="20"
                indeterminate
                color="primary">
                <template v-slot:default>
                    Waiting
                </template>
            </v-progress-linear>
            <v-progress-linear
                v-else-if="job.status === 'processing'"
                height="20"
                indeterminate
                color="warning">
                <template v-slot:default>
                    Processing
                </template>
            </v-progress-linear>
            <v-progress-linear
                v-else-if="job.status === 'completed'||job.status === 'failed'"
                height="20"
                model-value="100"
                :color="job.status === 'completed' ? 'success':'error'">
                <template v-slot:default>
                    {{ job.status === 'completed' ? 'Completed' : 'Failed' }}
                </template>
            </v-progress-linear>
        </v-list-item>
        <v-divider></v-divider>
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

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    id: string
}>();

const queueStore = useQueueStore();
const {jobMap} = storeToRefs(queueStore);

const {
    data: jobRes,
    refresh: refreshJob
} = useLazyAsyncData<JobResponse>(`job-res-${ props.id }`, async () => {
    return (await $mineskin.queue.get(props.id, {silent: true}));
}, {
    immediate: false,
    default: () => {
        return {job: jobMap.value[props.id]}
    }
});

const job = computed<JobInfo>(() => props.id && jobRes.value?.job);
const skin = computed(() => jobRes.value?.skin);

const refreshCounter = ref(0);

const jobTexture = computed(() => {
    if (jobRes.value?.links?.image) {
        return 'https://api.mineskin.org' + jobRes.value.links.image;
    }
    if (jobRes?.value?.skin) {
        return jobRes.value?.skin.texture.url.skin;
    }
    return null;
});

const tryJobRefresh = async () => {
    if (refreshCounter.value > 3) return;
    if (job.value) {
        if (job.value?.status !== 'waiting' && job.value?.status !== 'processing' && skin.value) {
            return;
        }
        if (job.value?.status === 'failed') {
            return;
        }
    }

    let oldStatus = job.value?.status;

    await sleep(500 + Math.random() * 800);

    await refreshJob();
    refreshCounter.value++;

    queueStore.addJob(job.value);

    if (oldStatus && oldStatus !== job.value?.status) {
        console.log('status changed', oldStatus, job.value?.status)
        if (job.value.status === 'failed' && jobRes.value?.errors) {
            for (let error of jobRes.value.errors) {
                $notify({
                    text: error.message,
                    color: 'error',
                    timeout: 2000
                });
            }
        }
    }

    setTimeout(() => tryJobRefresh(), 1300 + Math.random() * 1000);
}

onMounted(async () => {
    await tryJobRefresh();
})

</script>