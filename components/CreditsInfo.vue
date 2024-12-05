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
            :model-value="creditsUsed"
            :max="totalCredits"
            color="success"
        >
            <template v-slot:default>
                {{
                    $t('{used}/{total} credits used', {
                        used: creditsUsed,
                        total: totalCredits
                    })
                }}
            </template>
        </v-progress-linear>
        <a href="https://account.mineskin.org/membership" target="_blank" class="float-end">Details</a>
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
} = useLazyAsyncData<BasicCreditInfo>("credits-info", async () => {
    return (await $mineskin.me.credits())?.credit;
}, {
    immediate: false,
    server: false
});

const totalCredits = computed(() => credits.value?.all?.total || 0);
const creditsUsed = computed(() => totalCredits.value - (credits.value?.all?.balance || 0));

onMounted(async () => {
    if (!process.client) return;
    await authStore.checkAuth();
    await refreshCredits();
})
</script>
