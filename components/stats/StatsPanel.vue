<template>
    <div>
        <v-card>
            <v-card-text>
                <v-skeleton-loader v-if="!stats" type="paragraph"></v-skeleton-loader>
                <v-list>
                    <v-list-item>
                        <v-list-item-title class="text-h5">
                            <div class="d-inline"><strong>{{ formatNumber(totalTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>skins generated</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline"><span>{{ formatNumber(total.new) }} unique</span></div>
                            <div class="d-inline float-end text-end">since July 2016</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-2"/>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="d-inline"><strong>{{ formatNumber(todayTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>generated today</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                                <span>{{ formatNumber(today.new) }} unique</span>
                                <!--                                <span>{{ formatNumber(today.current.duplicate) }} duplicate</span>-->
                            </div>
                            <div class="d-inline float-end text-end">since 00:00UTC</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="d-inline"><strong>{{ formatNumber(monthTotal) }}</strong></div>
                            <div class="d-inline float-end text-end"><span>generated this month</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                                <span>{{ formatNumber(month.new) }} unique</span>
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
                            <div class="d-inline float-end text-end"><span>generated this year</span></div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-inline">
                                <span>{{ formatNumber(year.new) }} unique</span>
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
                <v-skeleton-loader v-if="!stats" type="paragraph"></v-skeleton-loader>
                <v-list>
                    <v-list-item>
                        <v-list-item-title>
                            <div class="text-h6">{{ generator.capacity.global }}</div>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            Generator Capacity
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

const {$mineskin} = useNuxtApp();

const {
    data: stats,
    refresh: refreshStats
} = useLazyAsyncData<Stats>(`stats`, async () => {
    return (await $mineskin.stats.get())?.stats;
}, {});

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
    setTimeout(() => {
        tick();
    }, (1000 / totalPerSecond.value) + 200 * Math.random());
}

onMounted(() => {
    setInterval(() => {
        refreshStats();
    }, 30000);
    tick();
})
</script>