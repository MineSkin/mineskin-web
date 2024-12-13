import { defineStore } from "pinia";
import type { JobInfo } from "@mineskin/types";
import type { JobWithMeta } from "~/types/JobWithMeta";
import { useAuthStore } from "~/stores/auth";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import { useLazyAsyncData } from "nuxt/app";
import type { JobListResponse } from "~/types/JobListResponse";
import { sleep } from "~/util/misc";
import { useSkinStore } from "~/stores/skins";

export const useQueueStore = defineStore('queue', () => {
    const jobMap = ref<Record<string, JobWithMeta>>({});

    const jobsDrawer = ref(false);

    let updateTimer: any;

    const localePath = useLocalePath();
    const {$mineskin, $notify} = useNuxtApp();

    const router = useRouter();
    const authStore = useAuthStore();
    const skinStore = useSkinStore();

    const jobsSorted = ref<JobWithMeta[]>([]);

    const {
        data: lazyJobList,
        refresh: refreshLazyJobList
    } = useLazyAsyncData<JobListResponse>('job-list', async () => {
        return await $mineskin.queue.list({silent: true});
    }, {
        immediate: false,
        server: false,
        default: () => {
            return {
                success: true,
                jobs: Object.values(jobMap.value),
            } as unknown as JobListResponse;
        }
    });

    const addJob = (job: JobWithMeta) => {
        console.debug('addJob', job);
        const existing = job.id ? jobMap.value[job.id] : undefined;
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
            await refreshLazyJobList();
            // const response = await $mineskin.queue.list({silent: true});
            const response = lazyJobList.value;
            if (response?.success) {
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

    const checkJobStatusChange = (now: JobInfo, prev?: JobInfo) => {
        if (prev?.status === now.status) return;
        console.debug(`${ now.id } ${ prev?.status } -> ${ now.status }`);
        $notify({
            text: `Job ${ now.id ? now.id : '' } is ${ now.status }`,
            color: now.status === 'completed' ? 'success' : now.status === 'failed' ? 'error' : 'info',
            timeout: (now.status === 'completed' || now.status === 'failed') ? 1200 : 800,
            actionLabel: now.status === 'completed' ? 'View' : undefined,
            actionLink: now.status === 'completed' && now.result ? `/skins/${ now.result }` : undefined
        });
        if (now.status === 'completed' && now.result) {
            skinStore.addSkin(now.result);
            setTimeout(() => {
                if (!hasPendingJobs.value && now.timestamp > Date.now() - 1000 * 60) {
                    router.push(localePath(`/skins/${ now.result }`));
                }
            }, 100);
        }
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
        storage: persistedState.localStorage
    }
})