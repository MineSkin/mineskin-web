<template>
    <v-progress-linear
        v-if="status in statusMap"
        height="20"
        :indeterminate="indeterminate"
        :model-value="progress"
        :color="statusMap[status].color">
        <template v-if="!hideText" v-slot:default>
            {{ $t(statusMap[status].text) }}
        </template>
    </v-progress-linear>
</template>
<script setup lang="ts">
import type { JobInfo, Maybe, SkinInfo2 } from "@mineskin/types";
import type { JobWithMeta } from "~/types/JobWithMeta";

const {$mineskin, $notify} = useNuxtApp();

const props = defineProps<{
    job?: JobWithMeta | JobInfo,
    waiting?: boolean,
    hideText?: boolean
}>();

const statusMap: Record<string, { color: string; text: string; }> = {
    'waiting': {
        color: 'primary',
        text: 'Waiting'
    },
    'processing': {
        color: 'warning',
        text: 'Processing'
    },
    'completed': {
        color: 'success',
        text: 'Completed'
    },
    'failed': {
        color: 'error',
        text: 'Failed'
    },
};

const status = computed(() => props.waiting ? 'waiting' : props.job?.status || 'waiting');

const indeterminate = computed(() => {
    const isPending = status.value !== 'completed' && status.value !== 'failed';
    if (props.job?.eta) {
        if (isPending) {
            return etaProgress.value >= 100 && stillProcessing.value;
        }
        return false;
    }
    return isPending;
});

const progress = computed(() => {
    if (status.value === 'completed') {
        return 100;
    }
    if (status.value === 'failed') {
        return 100;
    }
    return etaProgress.value || 0;
});

const etaProgress = ref(0);
const stillProcessing = ref(false);
const refreshEtaProgress = () => {
    if (props.job?.eta) {
        const started: number = props.job.timestamp;
        const eta: number = props.job.eta + 100;
        const now: number = Date.now();
        if (etaProgress.value < 100) {
            setTimeout(refreshEtaProgress, 500);
        }
        if (etaProgress.value >= 100) {
            stillProcessing.value = true;
            setTimeout(refreshEtaProgress, 500);
        }
        etaProgress.value = Math.min(100, Math.max(0, Math.floor(100 * (now - started) / (eta - started))));
    }
    if (!props.job) {
        setTimeout(refreshEtaProgress, 200);
    }
}

onMounted(() => {
    refreshEtaProgress();
})

</script>