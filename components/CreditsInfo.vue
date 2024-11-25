<template>
    <div v-if="authed">
        <v-progress-linear
            v-if="creditsStatus === 'pending'"
            height="20"
            indeterminate
            color="primary"
        />
        <v-progress-linear
            v-else-if="credits"
            height="20"
            :model-value="credits.all.total - credits.all.balance"
            :max="credits.all.total"
            color="success"
        >
            <template v-slot:default>
                {{ credits.all.total - credits.all.balance }} / {{ credits.all.total }} credits used
            </template>
        </v-progress-linear>
        <a href="https://account.mineskin.org/membership" target="_blank" class="float-end">Details</a>
    </div>
</template>
<script setup lang="ts">

import { useLazyAsyncData } from "nuxt/app";
import type { BasicCreditInfo } from "~/types/BasicCreditInfo";
import { useAuthStore } from "#imports";
import { storeToRefs } from "pinia";

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);

const {
    data: credits,
    status: creditsStatus,
    refresh: refreshCredits
} = useLazyAsyncData<BasicCreditInfo>("credits", async () => {
     if (!authed.value) {
        return {all: {balance: 0, total: 0}};
    }
    return (await $mineskin.me.credits())?.credit;
}, {
    immediate: false
});

onMounted(async () => {
    await authStore.checkAuth();
    await refreshCredits();
})
</script>
