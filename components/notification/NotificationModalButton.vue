<template>
    <div v-show="isHydrated&& showNotifications && notifications?.length>0">
        <slot name="button">
            <v-btn @click="dialog = true" icon="mdi-bell">
                <v-badge dot
                         v-if="isHydrated && notifications?.length>0"
                         color="primary"
                >
                    <v-icon icon="mdi-bell"/>
                </v-badge>
                <div v-else>
                    <v-icon icon="mdi-bell"/>
                </div>
            </v-btn>

        </slot>

        <v-dialog
            v-model="dialog"
            width="auto"
        >
            <v-card
                min-width="350"
                prepend-icon="mdi-bell"
                title="Notifications"
            >
                <template v-slot:text>
                    <NotificationList/>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLazyAsyncData } from "#app";
import type { SimpleNotification } from "@mineskin/types/src";
import { computed } from "vue";

const dialog = ref(false);

const {$mineskin, $account, $flags} = useNuxtApp();
const authStore = useAuthStore();

const isHydrated = ref(false);

const {
    data: notifications,
    refresh: refreshNotifications
} = useLazyAsyncData<SimpleNotification[]>(`notifications`, async () => {
    return (await $account.notifications.list())?.notifications;
}, {
    immediate: false
});

const showNotifications = computed(() => $flags.hasFeature('web.show_notifications'));

onMounted(() => {
    isHydrated.value = true;
    if (authStore.authed) {
        refreshNotifications();
    }
})
</script>