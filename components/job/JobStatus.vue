<template>
    <v-list-item v-if="id  &&wrappedJob && wrappedJob.job">
        <template v-slot:prepend>
            <div class="mr-2" style="width: 48px">
                <SkinHeadImg :texture="jobTexture"></SkinHeadImg>
            </div>
        </template>
        <template v-slot:title>
            <nuxt-link v-if="skin" :to="localePath('/skins/'+skin.uuid)" class="text-decoration-none">
                {{ jobDisplayName }}
            </nuxt-link>
            <span v-else>{{ wrappedJob.job?.id?.substring(0, 8) }}</span>
        </template>
        <template v-slot:subtitle>
            <DateLocal class="float-end" :date="wrappedJob.job?.timestamp"></DateLocal>
        </template>
        <JobProgressBar :job="wrappedJob.job" height="20"/>
        <v-divider/>
    </v-list-item>
</template>
<script setup lang="ts">
import type { JobInfo, Maybe, SkinInfo2 } from "@mineskin/types";
import { useQueueStore } from "~/stores/queue";
import type { JobResponse } from "~/types/JobResponse";
import DateLocal from "~/components/DateLocal.vue";
import { sleep } from "~/util/misc";
import { storeToRefs } from "pinia";
import JobProgressBar from "~/components/job/JobProgressBar.vue";
import type { WrappedJob } from "~/types/WrappedJob";

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    id: string
}>();

const localePath = useLocalePath()
const queueStore = useQueueStore();
const {wrappedJobMap} = storeToRefs(queueStore);

// const {
//     data: jobRes,
//     refresh: refreshJob
// } = useLazyAsyncData<JobResponse>(`job-res-${ props.id }`, async () => {
//     return (await $mineskin.queue.get(props.id, {silent: true}));
// }, {
//     immediate: false,
//     server: false,
//     default: () => {
//         return {job: jobMap.value[props.id]}
//     }
// });

const wrappedJob = ref<WrappedJob | undefined>(wrappedJobMap.value[props.id]);
const skin = computed<SkinInfo2 | undefined>(() => wrappedJob.value?.skin);

const refreshCounter = ref(0);

const jobDisplayName = computed(() => {
    if (wrappedJob.value?.source) {
        let name = wrappedJob.value.source.name;
        if (wrappedJob.value.source.type === 'url') {
            // url basename
            name = name.split('/').pop() || '';
        }
        // remove extension
        name = name.split('.')[0];
        // limit length
        name = name.substring(0, 32);

        return `${ name } (${ wrappedJob.value.job?.id?.substring(0, 8) })`;
    }
})

const jobTexture = computed<string | null>(() => {
    if (wrappedJob.value?.image) {
        return wrappedJob.value?.image;
    }
    if (wrappedJob.value?.skin) {
        return wrappedJob.value?.skin.texture.url.skin;
    }
    return null;
});

const tryJobRefresh = async () => {
    if (refreshCounter.value > 5) return;
    if (wrappedJob.value) {
        if (wrappedJob.value?.job?.status !== 'waiting' && wrappedJob.value?.job?.status !== 'processing' && skin.value) {
            return;
        }
        if (wrappedJob.value?.job?.status === 'failed') {
            return;
        }
    }

    let oldStatus = wrappedJob.value?.job?.status;

    await sleep(500 + Math.random() * 800);

    //await refreshJob();
    const jobRes: JobResponse = await $mineskin.queue.get(props.id, {silent: true});

    refreshCounter.value++;

    if (jobRes) {
        const job = jobRes.job;

        const wrapped = queueStore.updateJob(job, jobRes);
        if (wrapped) {
            wrappedJob.value = wrapped;
        }

        if (oldStatus && oldStatus !== job?.status) {
            console.log('status changed', oldStatus, job?.status)
            if (job.status === 'failed' && jobRes?.errors) {
                for (let error of jobRes.errors) {
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