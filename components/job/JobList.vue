<template>
    <v-list>
        <v-list-subheader>
            {{ $t("Jobs") }}
            <span>- <nuxt-link :to="localePath('/my-skins')">{{
                    $t("Show My Skins")
                }}</nuxt-link></span>
        </v-list-subheader>
        <JobStatus v-for="job in jobsSorted" :id="job.id" :key="job.id"/>
        <v-list-item v-if="jobsSorted.length<=0">
            <v-list-item-title>{{ $t("No jobs in queue") }}</v-list-item-title>
        </v-list-item>
        <!--        <dbg :data="queueStore.jobMap"></dbg>-->
        <!--        <dbg :data="queueStore.jobsSorted.map(j=>j.timestamp)"></dbg>-->
    </v-list>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";

const queueStore = useQueueStore();
const authStore = useAuthStore();
const localePath = useLocalePath();

const {jobsSorted} = storeToRefs(queueStore);

const {$mineskin} = useNuxtApp();

onMounted(async () => {
    if (!process.client) return;
    await authStore.checkAuth();
    await queueStore.refreshJobList();
})


</script>