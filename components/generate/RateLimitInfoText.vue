<template>
    <div>
        <div v-if="showMinute" class="font-weight-light">
            <span>You can generate <b>{{ minuteRemaining }}</b> more skins this minute</span>
            <span v-if="minuteReset">
            (resets in {{ minuteReset }})
            </span>
        </div>
        <div v-if="showHour" class="font-weight-light">
            <span>{{ showMinute ? 'and' : 'You can generate' }} <b>{{ hourRemaining }}</b> more skins this hour</span>
            <span v-if="hourReset">
            (resets in {{ hourReset }})
            </span>
        </div>
        <div v-if="(showMinute||showHour)&&(minuteRemaining<5||hourRemaining||30)">
            <action-link
                href="https://account.mineskin.org/store?utm_source=web&utm_medium=link&utm_campaign=generate_limit_upgrade"
                target="_blank"
                class="upgrade-text-gradient"
            >
                ✨ Upgrade
            </action-link>
            for higher limits and faster generation!
        </div>
    </div>
</template>
<script setup lang="ts">
import { useQueueStore } from "~/stores/queue";
import { useSettingsStore } from "~/stores/settings";
import { useIntervalFn } from "@vueuse/core";
import ActionLink from "~/components/ActionLink.vue";

const authStore = useAuthStore();
const queueStore = useQueueStore();
const settingsStore = useSettingsStore();

const hourLimit = computed(() => {
    if (queueStore.rateLimitHour.limit === 0) {
        if (!authStore.authed) {
            return 60;
        }
        return 0;
    }
    return queueStore.rateLimitHour.limit;
})

const showMinute = ref<boolean>(false);
const showHour = ref<boolean>(false);

const minuteRemaining = computed(() => {
    if (!queueStore.rateLimitMinute) return 0;
    return queueStore.rateLimitMinute.remaining;
})
// not force-limited by the backend atm, just show some limit for anonymous users
const hourRemaining = computed(() => {
    if (!queueStore.rateLimitHour) return;
    if (queueStore.rateLimitHour.limit === 0) {
        if (!authStore.authed) {
            return hourLimit.value - (queueStore.rateLimitHour.used || 0);
        }
    }
    return queueStore.rateLimitHour.remaining;
})

const minuteReset = ref<string>('');
const hourReset = ref<string>('');

useIntervalFn(() => {
    if (!queueStore.rateLimitMinute) {
        minuteReset.value = '';
        showMinute.value = false;
        return;
    }
    if (queueStore.rateLimitMinute.used <= 0) {
        minuteReset.value = '';
        showMinute.value = false;
        return;
    }
    const now = new Date().getTime() / 1000;
    if (queueStore.rateLimitMinute.reset <= now) {
        minuteReset.value = '';
        showMinute.value = false;
        return;
    }
    const secondDiff = Math.round((queueStore.rateLimitMinute.reset - now));
    if (secondDiff <= 0) {
        minuteReset.value = '';
        showMinute.value = false;
        return;
    }
    minuteReset.value = `${ secondDiff }s`;
    showMinute.value = true;
}, 1000, {immediateCallback: true});
useIntervalFn(() => {
    if (!queueStore.rateLimitHour) {
        hourReset.value = '';
        showHour.value = false;
        return;
    }
    if (queueStore.rateLimitHour.used <= 0 || hourLimit.value === 0) {
        hourReset.value = '';
        showHour.value = false;
        return;
    }
    const now = new Date().getTime() / 1000;
    if (queueStore.rateLimitHour.reset <= now) {
        hourReset.value = '';
        showHour.value = false;
        return;
    }
    const secondDiff = Math.round((queueStore.rateLimitHour.reset - now));
    if (secondDiff <= 0) {
        hourReset.value = '';
        showHour.value = false;
        return;
    }
    const minuteDiff = Math.floor(secondDiff / 60);
    const secondRemain = secondDiff % 60;
    if (minuteDiff > 0) {
        hourReset.value = `${ minuteDiff } minutes`;
    } else {
        hourReset.value = `${ secondRemain }s`;
    }
    showHour.value = true;
}, 30000, {immediateCallback: true});
</script>