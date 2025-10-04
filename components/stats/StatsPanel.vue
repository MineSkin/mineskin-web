<template>
    <v-row dense>
        <v-col>
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
                                <div class="d-inline float-end text-end"><span>{{ $t("generated this month") }}</span>
                                </div>
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
                                <div class="d-inline float-end text-end"><span>{{ $t("generated this year") }}</span>
                                </div>
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
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="6">
            <v-card class="mt-2">
                <v-card-text>
                    <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>
                    <v-list v-else>
                        <v-list-item>
                            <v-list-item-title>
                                <div class="text-h6">
                                    <span class="d-none d-xl-inline">More than </span>
                                    <strong>{{ timeSavedYears }} years</strong>
                                </div>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <v-tooltip :text="$t('For all MineSkin users, compared to manually changing skins')"
                                           location="bottom"
                                           open-on-click>
                                    <template v-slot:activator="{ props }">
                                        <abbr v-bind="props">
                                            <span>{{ $t("Time Saved") }}</span>
                                            <v-icon icon="mdi-information-outline" size="xs" class="ml-1"></v-icon>
                                        </abbr>
                                    </template>
                                </v-tooltip>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card class="mt-2">
                <v-card-text>
                    <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>
                    <v-list v-else>
                        <v-list-item>
                            <v-list-item-title>
                                <div class="text-h6">{{ formatNumber(daySuccessRate) }}%</div>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ $t("Success Rate") }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card class="mt-2">
                <v-card-text>
                    <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>
                    <v-list v-else>
                        <v-list-item>
                            <v-list-item-title>
                                <div class="text-h6">{{ usableAccounts }}</div>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <span class="d-none d-lg-block">{{ $t("Minecraft Accounts") }}</span>
                                <span class="d-block d-lg-none">{{ $t("MC Accounts") }}</span>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
        <!--        <v-col>-->
        <!--            <v-card class="mt-2">-->
        <!--                <v-card-text>-->
        <!--                    <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>-->
        <!--                    <v-list v-else>-->
        <!--                        <v-list-item>-->
        <!--                            <v-list-item-title class="text-h5">-->
        <!--                                <div class="d-inline"><span>More than <strong>{{ timeSavedHours }} hours</strong></span></div>-->
        <!--                                <div class="d-inline float-end text-end"><span>{{ $t("time saved") }}</span>-->
        <!--                                </div>-->
        <!--                            </v-list-item-title>-->
        <!--                            <v-list-item-subtitle>-->
        <!--&lt;!&ndash;                                <div class="d-inline">for all MineSkin users</div>&ndash;&gt;-->
        <!--                                <div class="d-inline float-end text-end">-->
        <!--                                    compared to manually changing skins-->
        <!--                                </div>-->
        <!--                            </v-list-item-subtitle>-->
        <!--                        </v-list-item>-->
        <!--                    </v-list>-->
        <!--                </v-card-text>-->
        <!--            </v-card>-->
        <!--        </v-col>-->
        <v-col cols="6">
            <v-card class="mt-2">
                <v-card-text>
                    <v-skeleton-loader v-if="!isHydrated || !stats" type="list-item-two-line"></v-skeleton-loader>
                    <v-list v-else>
                        <v-list-item>
                            <v-list-item-title>
                                <div class="text-h6">{{ minuteCapacity }}</div>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <v-tooltip :text="$t('Number of Skins that can be generated in 1 minute (estimate)')"
                                           location="bottom"
                                           open-on-click>
                                    <template v-slot:activator="{ props }">
                                        <abbr v-bind="props">
                                            <span class="d-none d-md-inline">{{ $t("Generator Capacity") }}</span>
                                            <span class="d-inline d-md-none">{{ $t("Capacity") }}</span>
                                            <v-icon icon="mdi-information-outline" size="xs" class="ml-1"></v-icon>
                                        </abbr>
                                    </template>
                                </v-tooltip>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
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

const daySuccessRate = computed(() => stats.value?.generated?.time?.day?.successRate || 0);

const generator = computed(() => stats.value?.generator);

const CAPACITY_WINDOW = 15;
const minuteCapacity = computed(() => {
    return (generator.value?.capacity?.global || 0) * (60 / CAPACITY_WINDOW);
})

const usableAccounts = computed(() => stats.value?.accounts?.usable?.global || 200)

const timeSavedYears = computed(() => {
    const manualDurationSeconds = 10.0;
    const mineskinDurationSeconds = 1.8;
    const totalGenerated = total.value.new;
    const totalTimeSavedSeconds = totalGenerated * (manualDurationSeconds - mineskinDurationSeconds);
    const totalTimeSavedYears = Math.floor(totalTimeSavedSeconds / 60 / 60 / 24 / 365);
    return formatNumber(totalTimeSavedYears);
});

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