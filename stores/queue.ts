import { defineStore, storeToRefs } from "pinia";
import type { JobInfo } from "@mineskin/types";
import type { JobWithMeta } from "~/types/JobWithMeta";
import { useAuthStore } from "~/stores/auth";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import { useLazyAsyncData } from "nuxt/app";
import type { JobListResponse } from "~/types/JobListResponse";
import { sleep } from "~/util/misc";
import { useSkinStore } from "~/stores/skins";
import type { WrappedJob } from "~/types/WrappedJob";
import type { JobResponse } from "~/types/JobResponse";
import { isCompletedJobRes } from "~/types/CompletedJob";
import { useGenerateStore } from "~/stores/generate";
import type { FileJson } from "~/util/file";

export const useQueueStore = defineStore('queue', () => {
    /**@deprecated**/
    const jobMap = ref<Record<string, JobWithMeta>>({});
    const wrappedJobMap = ref<Record<string, WrappedJob>>({});

    const jobsDrawer = ref(false);

    let updateTimer: any;

    const localePath = useLocalePath();
    const {$mineskin, $notify} = useNuxtApp();

    const router = useRouter();
    const authStore = useAuthStore();
    const skinStore = useSkinStore();
    const generateStore = useGenerateStore();
    const {
        uploadFiles,
        urls,
        users,

        generating
    } = storeToRefs(generateStore);

    const jobsSorted = ref<WrappedJob[]>([]);

    const lastJobSubmit = ref(0);

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

    const addJob = (job: WrappedJob) => {
        console.debug('addJob', job);
        let existing: WrappedJob | undefined;
        if (job.job.id) {
            existing = wrappedJobMap.value[job.job.id];
            if (!existing) {
                //TODO: remove
                const legacyExisting: JobWithMeta | undefined = jobMap.value[job.job.id];
                if (legacyExisting) {
                    existing = {
                        source: {
                            type: 'unknown',
                            content: '',
                            name: legacyExisting.originalName || 'unknown'
                        },
                        job: legacyExisting,
                        check: {
                            last: legacyExisting.lastStatusCheck,
                            count: 0
                        }
                    };
                }
            }
        }
        if (existing) {
            job = {
                ...existing,
                ...job
            };
        }

        wrappedJobMap.value[job.job.id] = job;
        jobMap.value[job.job.id] = job.job as JobWithMeta; //TODO: remove

        console.debug(jobsSorted.value.length);
        //checkJobStatusChange(job, existing);
        updateSortedJobs();

        if (!existing && (job.job.status !== 'waiting' && job.job.status !== 'processing')) {
            // trigger status check for e.g. duplicate skins
            checkJobStatusChange(job);
        }
    }

    const updateJob = (job: JobInfo, jobRes?: JobResponse): WrappedJob | undefined => {
        console.debug('updateJob', job);
        if (!job.id) return;
        let wrappedJob = wrappedJobMap.value[job.id];
        if (!wrappedJob) {
            console.debug('job to update not found', job.id);
            return;
        }
        const prevJob = {...{}, ...wrappedJob};
        wrappedJob.job = {
            ...wrappedJob.job,
            ...job
        };

        if (jobRes) {
            if (jobRes.links && 'image' in jobRes.links) {
                wrappedJob.image = 'https://api.mineskin.org' + jobRes.links.image;
            }
            if (isCompletedJobRes(jobRes)) {
                wrappedJob.skin = jobRes.skin;
            }
        }

        checkJobStatusChange(wrappedJob, prevJob);
        return wrappedJob;
    }

    const removeJobId = (jobId: string) => {
        delete jobMap.value[jobId];
        delete wrappedJobMap.value[jobId];
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
                    // addJob(job as JobWithMeta);
                    updateJob(job);
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
        const jobs = Object.values(wrappedJobMap.value);
        for (const job of jobs) {
            if (Date.now() - job.job.timestamp > 1000 * 60 * 60 * 24 * 2) {
                removeJobId(job.job.id);
                continue;
            }
        }
        const sorted = jobs.sort((a, b) => {
            return b.job.timestamp - a.job.timestamp;
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

    const checkJobStatusChange = (wrappedNow: WrappedJob, wrappedPrev?: WrappedJob) => {
        console.debug('checkJobStatusChange', wrappedNow, wrappedPrev);
        const now = wrappedNow.job;
        const prev = wrappedPrev?.job;
        if (prev?.status === now.status) return;
        console.debug(`${ now.id } ${ prev?.status } -> ${ now.status }`);
        $notify({
            text: `Job ${ now.id ? now.id : '' } is ${ now.status }`,
            color: now.status === 'completed' ? 'success' : now.status === 'failed' ? 'error' : 'info',
            timeout: (now.status === 'completed' || now.status === 'failed') ? 2000 : 1400,
            actionLabel: now.status === 'completed' ? 'View' : undefined,
            actionLink: now.status === 'completed' && now.result ? `/skins/${ now.result }` : undefined
        });
        if (now.status === 'completed' && now.result) {
            skinStore.addSkin(now.result);
            setTimeout(() => {
                if (!hasPendingJobs.value) {
                    generating.value = false;
                }
            }, 100);
            // setTimeout(() => {
            //     if (!hasPendingJobs.value && now.timestamp > Date.now() - 1000 * 60) {
            //         router.push(localePath(`/skins/${ now.result }`));
            //     }
            // }, 500);
            // setTimeout(() => {
            //     if (wrappedNow.source.type === 'file') {
            //         uploadFiles.value = uploadFiles.value.filter(file => file.name !== (wrappedNow.source.content as FileJson).name);
            //     }
            //     if (wrappedNow.source.type === 'url') {
            //         urls.value = urls.value.filter(url => url !== wrappedNow.source.content as string);
            //     }
            //     if (wrappedNow.source.type === 'user') {
            //         users.value = users.value.filter(user => user !== wrappedNow.source.content as string);
            //     }
            // }, 1000);
        }
    }

    const jobCount = computed(() => {
        return Object.keys(wrappedJobMap.value).length;
    });
    const pendingJobCount = computed(() => {
        return Object.values(jobsSorted.value).filter(job => job.job.status === 'waiting' || job.job.status === 'processing').length;
    });

    const hasPendingJobs = computed(() => {
        return jobsSorted.value.some(job => job.job.status === 'waiting' || job.job.status === 'processing');
    });


    return {
        jobMap,
        wrappedJobMap,
        jobsSorted,
        addJob,
        updateJob,
        removeJobId,
        removeJob,
        refreshJobList,
        // updatePendingJobs,
        updateSortedJobs,
        jobCount,
        pendingJobCount,
        hasPendingJobs,
        jobsDrawer,
        lastJobSubmit
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['jobMap', 'wrappedJobMap']
    }
})