import { defineStore } from "pinia";
import type { JobInfo } from "@mineskin/types";

export const useQueueStore = defineStore('queue', () => {
    const jobIds = ref<string[]>([]);
    const jobs = ref<JobInfo[]>([]);
    const refreshes = ref<Map<string, number>>(new Map());

    const jobsDrawer = ref(false);

    let updateTimer: any;

    const {$mineskin,$notify} = useNuxtApp();

    const addJob = (job: JobInfo) => {
        jobIds.value.push(job.id);
        jobs.value.push(job);
        checkJobStatusChange(job);
    }

    const removeJobId = (jobId: string) => {
        const index = jobIds.value.indexOf(jobId);
        if (index > -1) {
            jobIds.value.splice(index, 1);
        }

        const jobIndex = jobs.value.findIndex(job => job.id === jobId);
        if (jobIndex > -1) {
            jobs.value.splice(jobIndex, 1);
        }
    }

    const removeJob = (job: JobInfo) => {
        removeJobId(job.id);
    }

    const refreshJobList = async () => {
        const response = await $mineskin.queue.list();
        if (response.success) {
            jobIds.value = response.jobs.map(job => job.id);
            jobs.value = response.jobs;
        }

        if (!updateTimer) {
            updateTimer = setInterval(() => {
                updatePendingJobs();
            }, 1000);
        }
    }

    const updatePendingJobs = async () => {
        for (const job of jobs.value) {
            if (job.status === 'waiting' || job.status === 'processing') {
                const r = refreshes.value.get(job.id);
                if (r > 5) {
                    continue;
                }
                refreshes.value.set(job.id, (r || 0) + 1);

                const response = await $mineskin.queue.get(job.id);
                if (response.success) {
                    const index = jobs.value.findIndex(j => j.id === job.id);
                    if (index > -1) {
                        jobs.value[index] = response.job;
                    }
                    checkJobStatusChange(response.job, job);
                }
            }
        }
    }

    const checkJobStatusChange = (now: JobInfo,prev?: JobInfo) => {
        console.debug(`${now.id} ${prev?.status} -> ${now.status}`);
        if(prev?.status === now.status) return;
        $notify({
            text: `Job ${now.id} is now ${now.status}`,
            color: now.status==='completed'? 'success':now.status==='failed'?'error':'info'
        });
    }

    const hasPendingJobs = computed(() => {
        return jobs.value.some(job => job.status === 'waiting' || job.status === 'processing');
    });

    return {
        jobIds,
        jobs,
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
        paths: ['jobs']
    }
})