<template>
    <div>
        <v-alert v-if="notifications?.length<=0" text="No notifications"/>
        <v-alert v-for="notification in notifications" :key="notification.id"
                 border="start"
                 :border-color="notification.level||'primary'"
                 :title="notification.title"
                 closable
                 @click:close="dismissNotification(notification.id)"
        >
            <template v-slot:text>
                <div>{{ notification.message }}</div>
                <div v-if="notification.links?.length>0" class="mt-2">
                    <v-btn v-for="link in notification.links" :key="link.url" :href="link.url" variant="text">
                        {{ link.title }}
                    </v-btn>
                </div>
                <div class="text-right">
                    <span class="text-caption"><DateLocal :date="notification.createdAt"/></span>
                </div>
            </template>
        </v-alert>
    </div>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";
import type { SimpleNotification } from "@mineskin/types/src";
import { useAuthStore } from "~/stores/auth";
import { useNuxtData } from "#imports";

const {$mineskin, $account} = useNuxtApp();
const authStore = useAuthStore();

const {data: notifications} = useNuxtData<SimpleNotification[]>('notifications');

const dismissNotification = async (id: string) => {
    notifications.value = notifications.value?.filter(n => n.id !== id) || [];
    await $account.notifications.dismiss(id);
}
</script>