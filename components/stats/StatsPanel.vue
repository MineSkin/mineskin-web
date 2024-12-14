<template>
    <div>
        <v-card>
            <v-card-text>
                <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line@4"></v-skeleton-loader>
                <v-list v-else>
                    <v-list-item>
                        <v-list-item-title class="text-h5">
                            <div class="d-inline"><strong>{{ formatNumber(totalTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>{{ $t("skins generated") }}</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                                <span>
                                    {{
                                        $t("{new} unique", {
                                            new: formatNumber(total.new)
                                        })
                                    }}
                                </span>
                            </div>
                            <div class="d-inline float-end text-end">since July 2016</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-2"/>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="d-inline"><strong>{{ formatNumber(todayTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>{{ $t("generated today") }}</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                                <span>
                                    {{
                                        $t("{new} unique", {
                                            new: formatNumber(today.new)
                                        })
                                    }}
                                </span>
                                <!--                                <span>{{ formatNumber(today.current.duplicate) }} duplicate</span>-->
                            </div>
                            <div class="d-inline float-end text-end">since 00:00UTC</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="d-inline"><strong>{{ formatNumber(monthTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>{{ $t("generated this month") }}</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                               <span>
                                    {{
                                       $t("{new} unique", {
                                           new: formatNumber(month.new)
                                       })
                                   }}
                                </span>
                                <!--                                <span>{{ formatNumber(month.current.duplicate) }} duplicate</span>-->
                            </div>
                            <div class="d-inline float-end text-end">
                                {{ date.getUTCMonth() + 1 }}/{{ date.getUTCFullYear() }}
                            </div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="d-inline"><strong>{{ formatNumber(yearTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>{{ $t("generated this year") }}</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                               <span>
                                    {{
                                       $t("{new} unique", {
                                           new: formatNumber(year.new)
                                       })
                                   }}
                                </span>
                                <!--                                <span>{{ formatNumber(year.current.duplicate) }} duplicate</span>-->
                            </div>
                            <div class="d-inline float-end text-end">{{ date.getUTCFullYear() }}</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <!--                <v-divider/>-->
                </v-list>
                <!--            <dbg :data="stats"/>-->
                <!--                <div class="float-end text-end">-->
                <!--                    <span>updated {{ updatedSecondsAgo }}s ago</span>-->
                <!--                </div>-->
            </v-card-text>
        </v-card>
        <v-card class="mt-2">
            <v-card-text>
                <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>
                <v-list v-else>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="text-h6">{{ generator?.capacity?.global || 0 }}</div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ $t("Generator Capacity") }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";
import type { NewDup, Stats } from "~/types/Stats";
import { useInterval, useIntervalFn, useTimeoutFn } from "@vueuse/core";

const {$mineskin} = useNuxtApp();

const isHydrated = ref(false);

const {
    data: stats,
    refresh: refreshStats
} = useLazyAsyncData<Stats>(`stats`, async () => {
    return (await $mineskin.stats.get())?.stats;
}, {
    immediate: false
});

const date = new Date();

const FALLBACK: NewDup = {new: 0, duplicate: 0};

const numberFormat = new Intl.NumberFormat('en-US');

const formatNumber = (num: number) => numberFormat.format(num);

const today = computed<NewDup>(() => stats.value?.generated?.time?.day?.current || FALLBACK);
const todayTotal = computed(() => (today.value?.new + today.value?.duplicate) || 0);

const month = computed<NewDup>(() => stats.value?.generated?.time?.month?.current || FALLBACK);
const monthTotal = computed(() => (month.value?.new + month.value?.duplicate) || 0);

const year = computed<NewDup>(() => stats.value?.generated?.time?.year?.current || FALLBACK);
const yearTotal = computed(() => (year.value?.new + year.value?.duplicate) || 0);

const hour = computed<NewDup>(() => stats.value?.generated?.time?.hour?.current || FALLBACK);
const hourTotal = computed(() => (hour.value?.new + hour.value?.duplicate) || 0);

const totalPerSecond = computed(() => (hourTotal.value || 1) / 60 / 60);

const total = computed<NewDup>(() => stats.value?.generated?.total || FALLBACK);
const totalTotal = computed(() => (total.value?.new + total.value?.duplicate) || 0);

const generator = computed(() => stats.value?.generator);

const tick = () => {
    if (stats.value) {
        if (Math.random() < 0.5) {
            today.value.new++;
            month.value.new++;
            year.value.new++;
            // stats.value.generated.total.new++;
        } else {
            today.value.duplicate++;
            month.value.duplicate++;
            year.value.duplicate++;
            // stats.value.generated.total.duplicate++;
        }
    }
    useTimeoutFn(() => {
        tick();
    }, (1000 / totalPerSecond.value) + 200 * Math.random());
}

onMounted(() => {
    isHydrated.value = true;
    useIntervalFn(() => {
        refreshStats();
    }, 30000);
    tick();
    refreshStats();
})
</script>