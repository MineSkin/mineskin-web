import { defineStore } from "pinia";
import type { JobInfo } from "@mineskin/types";
import type { JobWithMeta } from "~/types/JobWithMeta";
import { useAuthStore } from "~/stores/auth";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";

export const useQueueStore = defineStore('queue', () => {
    const jobMap = ref<Record<string, JobWithMeta>>({});

    const jobsDrawer = ref(false);

    let updateTimer: any;

    const {$mineskin, $notify} = useNuxtApp();

    const authStore = useAuthStore();

    const jobsSorted = ref<JobWithMeta[]>([]);

    const addJob = (job: JobWithMeta) => {
        console.debug('addJob', job);
        const existing = job.id === 'unknown' ? undefined : jobMap.value[job.id];
        if (existing) {
            job = {
                ...existing,
                ...job
            }
        }
        if (!job.lastStatusCheck) {
            job.lastStatusCheck = Date.now();
        }
        if (!job.statusCheckCount) {
            job.statusCheckCount = 0;
        }
        jobMap.value[job.id] = job;
        console.debug(jobsSorted.value.length);
        checkJobStatusChange(job, existing);
        updateSortedJobs();
    }

    const removeJobId = (jobId: string) => {
        delete jobMap.value[jobId];
    }

    const removeJob = (job: JobInfo) => {
        removeJobId(job.id);
    }

    const refreshJobList = async () => {
        if (authStore.authed) {
            const response = await $mineskin.queue.list({silent: true});
            if (response.success) {
                for (const job of response.jobs) {
                    addJob(job as JobWithMeta);
                }
            }
        }

        // if (!updateTimer) {
        //     updateTimer = setInterval(() => {
        //         updatePendingJobs();
        //     }, 1600);
        // }
        updateSortedJobs();
    }

    const updateSortedJobs = () => {
        const jobs = Object.values(jobMap.value);
        for (const job of jobs) {
            if (Date.now() - job.timestamp > 1000 * 60 * 60 * 24 * 2) {
                removeJobId(job.id);
                continue;
            }
        }
        const sorted = jobs.sort((a, b) => {
            return b.timestamp - a.timestamp;
        }).slice(0, 8);
        jobsSorted.value = sorted;
    }

    // const updatePendingJobs = async () => {
    //     const list = Object.values(jobMap.value);
    //     for (const job of list) {
    //         if (Date.now() - job.timestamp > 1000 * 60 * 60 * 24 * 2) {
    //             removeJobId(job.id);
    //             continue;
    //         }
    //         if (job.id === 'unknown') continue;
    //         if (job.status === 'waiting' || job.status === 'processing') {
    //             if (Date.now() - job.lastStatusCheck < 1800 * job.statusCheckCount) {
    //                 continue;
    //             }
    //             if (job.statusCheckCount > 10) {
    //                 continue;
    //             }
    //
    //             job.statusCheckCount++;
    //             job.lastStatusCheck = Date.now();
    //
    //             const response: GenerateJobResponse = await $mineskin.queue.get(job.id, {silent: true});
    //             if (response.success) {
    //                 addJob(response.job as JobWithMeta);
    //                 if (response.job.status === 'failed') {
    //                     for (let error of response.errors) {
    //                         $notify({
    //                             text: error.message,
    //                             color: 'error',
    //                             timeout: 2200
    //                         });
    //                     }
    //                 }
    //             } else {
    //                 job.statusCheckCount++;
    //             }
    //         }
    //     }
    //     updateSortedJobs();
    // }

    //TODO: save generated skins in local storage

    const checkJobStatusChange = (now: JobInfo, prev?: JobInfo) => {
        if (prev?.status === now.status) return;
        console.debug(`${ now.id } ${ prev?.status } -> ${ now.status }`);
        $notify({
            text: `Job ${ now.id === 'unknown' ? '' : now.id } is ${ now.status }`,
            color: now.status === 'completed' ? 'success' : now.status === 'failed' ? 'error' : 'info',
            timeout: (now.status === 'completed' || now.status === 'failed') ? 1200 : 800
        });
    }

    const hasPendingJobs = computed(() => {
        return jobsSorted.value.some(job => job.status === 'waiting' || job.status === 'processing');
    });


    return {
        jobMap,
        jobsSorted,
        addJob,
        removeJobId,
        removeJob,
        refreshJobList,
        // updatePendingJobs,
        updateSortedJobs,
        hasPendingJobs,
        jobsDrawer
    }
}, {
    persist: {
        storage: persistedState.localStorage,
        paths: ['jobMap']
    }
})