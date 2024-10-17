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
            :model-value="credits.balance"
            :max="credits.total"
            color="success"
        >
            <template v-slot:default>
                {{ credits.total - credits.balance }} / {{ credits.total }} {{ credits.type }} credits used
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
} = useLazyAsyncData<BasicCreditInfo>("credits", async () => {
    return (await $mineskin.me.credits())?.credit;
});
</script>
