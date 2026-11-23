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
            <span v-else>{{ jobDisplayName }}</span>
        </template>
        <template v-slot:subtitle>
            <DateLocal class="float-end" :date="wrappedJob.job?.timestamp"></DateLocal>
        </template>
        <JobProgressBar :job="wrappedJob.job" height="20"/>
        <div v-if="wrappedJob.job?.status === 'failed' && wrappedJob.error" class="text-caption text-error mt-1">
            {{ wrappedJob.error }}
        </div>
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
import { jobSourceName } from "~/util/job";

const {$mineskin} = useNuxtApp();

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
    const shortId = wrappedJob.value?.job?.id?.substring(0, 8);
    const name = jobSourceName(wrappedJob.value);
    // jobs that weren't submitted from this browser don't have a source name
    return name ? `${ name } (${ shortId })` : shortId;
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

let unmounted = false;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;

const tryJobRefresh = async () => {
    if (unmounted) return;
    if (refreshCounter.value > 40) return;
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
    if (unmounted) return;

    try {
        //await refreshJob();
        const jobRes: JobResponse = await $mineskin.queue.get(props.id, {silent: true});

        if (jobRes) {
            const job = jobRes.job;

            const wrapped = queueStore.updateJob(job, jobRes);
            if (wrapped) {
                wrappedJob.value = wrapped;
            }

            // the store notifies about status changes, including the reason a job failed
            if (oldStatus && oldStatus !== job?.status) {
                console.log('status changed', oldStatus, job?.status)
            }
        }
    } catch (e) {
        // transient network/API error - keep polling instead of giving up on this job silently
        console.error('job refresh failed', e);
    }

    refreshCounter.value++;

    refreshTimer = setTimeout(() => tryJobRefresh(), Math.min(600 + Math.random() * 600 + refreshCounter.value * 200, 6000));
}

onBeforeUnmount(() => {
    // stop polling once the job is no longer in the list
    unmounted = true;
    clearTimeout(refreshTimer);
});

onMounted(async () => {
    await tryJobRefresh();
})

</script>