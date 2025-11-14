<template>
    <v-row dense>
        <v-col>
            <v-card>
                <v-card-text>
                    <v-row dense>
                        <v-col class="text-h6 font-weight-regular">
                            Powered by
                            <span class="font-weight-bold">{{ members }} awesome
                                <a class="text-decoration-none text-white"
                                   href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=powered-by">Members</a></span>
                            and <span class="font-weight-bold">{{ accounts }} Minecraft Accounts</span>
                            provided by the <span>MineSkin Community</span>!
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="text-h6 font-weight-light">
                            Made with ❤️ and ☕
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";
import type { AccountStats, Stats } from "~/types/Stats";

const {$mineskin, $account} = useNuxtApp();

const isHydrated = ref(false);

const {
    data: stats,
    refresh: refreshStats
} = useLazyAsyncData<Stats>(`stats1`, async () => {
    return (await $mineskin.stats.get())?.stats;
}, {
    immediate: false
});

const {
    data: accountStats,
    refresh: refreshAccountStats
} = useLazyAsyncData<AccountStats>(`accountStats`, async () => {
    return (await $account.stats.get())?.stats;
}, {
    immediate: false
});

const accounts = computed(() => stats.value?.accounts?.usable?.global ?? 100);
const members = computed(() => accountStats.value?.members ?? 10);


onMounted(() => {
    isHydrated.value = true;
    refreshStats();
    refreshAccountStats();
})
</script>