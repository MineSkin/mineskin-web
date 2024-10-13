import {defineStore} from "pinia";

export const useQueueStore = defineStore('queue', ()=>{
    const jobIds = ref<string[]>([]);

    const addJob = (jobId: string) => {
        jobIds.value.push(jobId);
    }

    const removeJob = (jobId: string) => {
        const index = jobIds.value.indexOf(jobId);
        if (index > -1) {
            jobIds.value.splice(index, 1);
        }
    }

    return {
        jobIds,
        addJob,
        removeJob
    }
})