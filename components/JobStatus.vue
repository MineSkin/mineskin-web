<template>
    <v-list-item>
        <template v-slot:title>
            {{ job.id?.substring(0,8) }}
        </template>
        <v-progress-linear
            v-if="job.status === 'waiting'"
            height="20"
            indeterminate
            color="primary">
            <template v-slot:default>
                Waiting
            </template>
        </v-progress-linear>
        <v-progress-linear
            v-else-if="job.status === 'processing'"
            height="20"
            indeterminate
            color="warning">
            <template v-slot:default>
                Processing
            </template>
        </v-progress-linear>
        <v-progress-linear
            v-else-if="job.status === 'completed'||job.status === 'failed'"
            height="20"
            indeterminate
            :color="job.status === 'completed' ? 'success':'error'">
            <template v-slot:default>
                Done
            </template>
        </v-progress-linear>
    </v-list-item>
</template>
<script setup lang="ts">
import type { JobInfo } from "@mineskin/types";

const props = defineProps<{
    job: JobInfo;
}>();
</script>