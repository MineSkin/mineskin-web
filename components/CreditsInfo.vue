<template>
    <div v-if="authStore.authed">
        <v-progress-linear
            v-if="creditsStatus === 'pending'"
            height="20"
            indeterminate
            color="primary"
        />
        <v-progress-linear
            v-else-if="credits"
            height="20"
            :model-value="credits.all.balance"
            :max="credits.all.total"
            color="success"
        >
            <template v-slot:default>
                {{ credits.all.total - credits.all.balance }} / {{ credits.all.total }} credits used
            </template>
        </v-progress-linear>
    </div>
</template>
<script setup lang="ts">

import { useLazyAsyncData } from "nuxt/app";
import type { BasicCreditInfo } from "~/types/BasicCreditInfo";
import { useAuthStore } from "#imports";

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();

const {
    data: credits,
    status: creditsStatus,
    refresh: refreshCredits
} = useLazyAsyncData<BasicCreditInfo>("credits", async () => {
    return (await $mineskin.me.credits())?.credit;
}, {
    immediate: false
});

onMounted(async () => {
    await authStore.checkAuth();
    await refreshCredits();
})
</script>
