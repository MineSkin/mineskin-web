import { defineStore } from "pinia";
import type { JobInfo } from "@mineskin/types";

export const useQueueStore = defineStore('queue', () => {
    const jobIds = ref<string[]>([]);
    const jobs = ref<JobInfo[]>([]);

    const {$mineskin} = useNuxtApp();

    const addJob = (job: JobInfo) => {
        jobIds.value.push(job.id);
        jobs.value.push(job);
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
    }

    return {
        jobIds,
        jobs,
        addJob,
        removeJobId,
        removeJob,
        refreshJobList
    }
})