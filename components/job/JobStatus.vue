<template>
    <v-list-item v-if="id  &&job">
        <template v-slot:prepend>
            <div class="mr-2" style="width: 48px">
                <SkinHeadImg :texture="jobTexture"></SkinHeadImg>
            </div>
        </template>
        <template v-slot:title>
            <nuxt-link v-if="skin" :to="localePath('/skins/'+skin.uuid)" class="text-decoration-none">{{
                    job.id?.substring(0, 8)
                }}
            </nuxt-link>
            <span v-else>{{ job.id?.substring(0, 8) }}</span>
        </template>
        <template v-slot:subtitle>
            <DateLocal class="float-end" :date="job.timestamp"></DateLocal>
        </template>
        <JobProgressBar :job="job" height="20"/>
        <v-divider/>
    </v-list-item>
</template>
<script setup lang="ts">
import type { JobInfo, Maybe, SkinInfo2 } from "@mineskin/types";
import { useLazyAsyncData } from "#app";
import { useQueueStore } from "~/stores/queue";
import type { JobResponse } from "~/types/JobResponse";
import DateLocal from "~/components/DateLocal.vue";
import { sleep } from "~/util/misc";
import { storeToRefs } from "pinia";
import type { JobWithMeta } from "~/types/JobWithMeta";
import JobProgressBar from "~/components/job/JobProgressBar.vue";

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    id: string
}>();

const localePath = useLocalePath()
const queueStore = useQueueStore();
const {jobMap} = storeToRefs(queueStore);

const {
    data: jobRes,
    refresh: refreshJob
} = useLazyAsyncData<JobResponse>(`job-res-${ props.id }`, async () => {
    return (await $mineskin.queue.get(props.id, {silent: true}));
}, {
    immediate: false,
    server: false,
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
    if (refreshCounter.value > 5) return;
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

    if (job.value) {
        queueStore.addJob(job.value as JobWithMeta);
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
    }

    setTimeout(() => tryJobRefresh(), 600 + Math.random() * 600 + refreshCounter.value * 200);
}

onMounted(async () => {
    await tryJobRefresh();
})

</script>