<template>
    <div v-if="id !== 'unknown' &&job">
        <v-list-item>
            <template v-slot:prepend>
                <div class="mr-2" style="width: 48px">
                    <SkinHeadImg :texture="jobTexture"></SkinHeadImg>
                </div>
            </template>
            <template v-slot:title>
                <router-link v-if="skin" :to="'/'+skin.uuid" class="text-decoration-none">{{ job.id?.substring(0, 8) }}</router-link>
                <span v-else>{{ job.id?.substring(0, 8) }}</span>
            </template>
            <template v-slot:subtitle>
                <DateUTC class="float-end" :date="job.timestamp"></DateUTC>
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
                model-value="100"
                :color="job.status === 'completed' ? 'success':'error'">
                <template v-slot:default>
                    Done
                </template>
            </v-progress-linear>
        </v-list-item>
        <v-divider></v-divider>
    </div>
</template>
<script setup lang="ts">
import type { JobInfo, Maybe, SkinInfo2 } from "@mineskin/types";
import { computedAsync } from "@vueuse/core";
import { useLazyAsyncData } from "#app";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import type { JobResponse } from "~/types/JobResponse";
import DateUTC from "~/components/DateUTC.vue";

const {$mineskin} = useNuxtApp();

const props = defineProps<{
    id: string
}>();


const {
    data: jobRes
} = useLazyAsyncData<JobResponse>(`job-res-${ props.id }`, async () => {
    return (await $mineskin.queue.get(props.id));
});

const job = computed(() => props.id !== 'unknown' && jobRes.value?.job);
const skin = computed(() => jobRes.value?.skin);

const jobTexture = computed(() => {
    if (jobRes.value?.links?.image) {
        return 'https://api.mineskin.org' + jobRes.value.links.image;
    }
    if (jobRes?.value?.skin) {
        return jobRes.value?.skin.texture.url.skin;
    }
    return null;
});
</script>