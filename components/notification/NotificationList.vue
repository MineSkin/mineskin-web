<template>
    <v-list>
        <v-list-item v-if="notifications?.length<=0">
            <v-list-item-title>No notifications</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="notification in notifications" :key="notification.id">
            <v-list-item-title :class="'text-'+(notification.level||'primary')">{{ notification.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
            <v-list-item-action>
                <v-btn @click="dismissNotification(notification.id)">Dismiss</v-btn>
            </v-list-item-action>
        </v-list-item>
    </v-list>
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
    notifications.value = notifications.value?.filter(n => n.id !== id)||[];
    //await $account.notifications.dismiss(id);
}
</script>