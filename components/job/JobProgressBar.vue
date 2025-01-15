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
    return status.value !== 'completed' && status.value !== 'failed';
});
const progress = computed(() => {
    if (status.value === 'completed') {
        return 100;
    }
    if (status.value === 'failed') {
        return 100;
    }
    return 0;
});

</script>