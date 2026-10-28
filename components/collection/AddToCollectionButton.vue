<template>
    <v-menu v-model="menu" v-if="authStore.authed && $flags.hasFeature('web.collections')">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                icon="mdi-folder-plus"
                variant="text"
                density="compact"
                :aria-label="$t('Add to collection')"
                :loading="loading || adding"
            />
        </template>
        <v-list v-if="collectionsRes?.success && !loading" density="compact">
            <v-list-item
                v-for="collection in collectionsRes.collections"
                :key="collection.uuid"
                :title="collection.name"
                :disabled="adding"
                @click="add(collection)"
            />
            <v-list-item
                v-if="collectionsRes.collections.length === 0"
                :title="$t('Create a collection on My Skins')"
                :to="localePath('/my-skins')"
            />
        </v-list>
    </v-menu>
</template>
<script setup lang="ts">
import type { CollectionListResponse, ListedCollection } from "~/types/Collection";

const props = defineProps<{
    skin: string
}>();

const {$mineskin, $notify, $flags} = useNuxtApp();
const {t: $t} = useI18n();
const localePath = useLocalePath();
const authStore = useAuthStore();

const menu = ref(false);
const loading = ref(false);
const adding = ref(false);
const collectionsRes = ref<CollectionListResponse>();

watch(menu, async (value) => {
    if (!value || !authStore.authed || !$flags.hasFeature('web.collections')) return;
    loading.value = true;
    try {
        collectionsRes.value = await $mineskin.me.collections();
    } finally {
        loading.value = false;
    }
});

async function add(collection: ListedCollection) {
    if (adding.value || !authStore.authed || !$flags.hasFeature('web.collections')) return;
    adding.value = true;
    try {
        const res = await $mineskin.collections.addSkin(collection.uuid, props.skin);
        if (res?.success) {
            $notify({
                text: res.added ? $t('Added to {name}', {name: collection.name}) : $t('Already in {name}', {name: collection.name}),
                color: 'success',
                actionLabel: $t('View'),
                actionLink: '/collections/' + collection.uuid
            });
        }
    } finally {
        adding.value = false;
    }
}
</script>
