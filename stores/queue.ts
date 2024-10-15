import { defineStore } from "pinia";
import type { JobInfo } from "@mineskin/types";
import type { JobWithSkin } from "~/types/JobWithSkin";

export const useQueueStore = defineStore('queue', () => {
    const jobMap = ref<Record<string, JobInfo>>({});
    const refreshes = ref<Map<string, number>>(new Map());

    const jobsDrawer = ref(false);

    let updateTimer: any;

    const {$mineskin, $notify} = useNuxtApp();

    const jobs = computed(() => Array.from(Object.values(jobMap.value)));

    const jobsSorted = computed(() => {
        return jobs.value.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    });

    const addJob = (job: JobInfo) => {
        const existing = jobMap.value[job.id];
        if (existing) {
            job = {
                ...existing,
                ...job
            }
        }
        jobMap.value[job.id]=job;
        checkJobStatusChange(job, existing);
    }

    const removeJobId = (jobId: string) => {
        delete jobMap.value[jobId];
    }

    const removeJob = (job: JobInfo) => {
        removeJobId(job.id);
    }

    const refreshJobList = async () => {
        const response = await $mineskin.queue.list();
        if (response.success) {
            for (const job of response.jobs) {
                addJob(job);
            }
        }

        if (!updateTimer) {
            updateTimer = setInterval(() => {
                updatePendingJobs();
            }, 1000);
        }
    }

    const updatePendingJobs = async () => {
        for (const job of jobs.value.values()) {
            if (job.status === 'waiting' || job.status === 'processing') {
                const r = refreshes.value.get(job.id);
                if (r > 5) {
                    continue;
                }
                refreshes.value.set(job.id, (r || 0) + 1);

                const response = await $mineskin.queue.get(job.id);
                if (response.success) {
                    addJob(response.job);
                }
            }
        }
    }

    const checkJobStatusChange = (now: JobInfo, prev?: JobInfo) => {
        if (prev?.status === now.status) return;
        console.debug(`${ now.id } ${ prev?.status } -> ${ now.status }`);
        $notify({
            text: `Job ${ now.id==='unknown'?'':now.id } is now ${ now.status }`,
            color: now.status === 'completed' ? 'success' : now.status === 'failed' ? 'error' : 'info'
        });
    }

    const hasPendingJobs = computed(() => {
        return jobs.value.some(job => job.status === 'waiting' || job.status === 'processing');
    });


    return {
        jobMap,
        jobs,
        jobsSorted,
        addJob,
        removeJobId,
        removeJob,
        refreshJobList,
        updatePendingJobs,
        hasPendingJobs,
        jobsDrawer
    }
}, {
    persist: {
        storage: persistedState.localStorage,
        paths: ['jobMap']
    }
})