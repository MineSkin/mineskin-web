<template>
    <v-container v-if="$flags.hasFeature('web.collections')" class="mb-4">
        <v-row v-if="collectionNotFound" justify="center" class="my-8">
            <v-col cols="12" md="6" class="text-center">
                <v-alert type="warning" variant="tonal">
                    {{ $t('This collection could not be found. It may be private, deleted, or the link may be incorrect.') }}
                </v-alert>
                <back-link to="/skins">
                    <v-btn class="mt-4" color="primary" prepend-icon="mdi-arrow-left">
                        {{ $t('Back to Gallery') }}
                    </v-btn>
                </back-link>
            </v-col>
        </v-row>
        <template v-else-if="collection">
            <h2 class="d-flex align-center flex-wrap ga-2">
                <back-link :to="collection.owned ? '/my-skins' : '/skins'" class="text-white" :aria-label="collection.owned ? $t('My Skins') : $t('Back to Gallery')">
                    <v-icon icon="mdi-arrow-left" class="mx-2"/>
                </back-link>
                <span class="text-break">{{ collection.name }}</span>
                <v-tooltip :text="collection.visibility === SkinVisibility2.PRIVATE ? $t('Private') : collection.visibility === SkinVisibility2.UNLISTED ? $t('Unlisted') : $t('Public')">
                    <template v-slot:activator="{ props }">
                        <span v-bind="props">
                            <v-icon>{{ collection.visibility === SkinVisibility2.PRIVATE ? 'mdi-eye-off' : collection.visibility === SkinVisibility2.UNLISTED ? 'mdi-link' : 'mdi-earth' }}</v-icon>
                        </span>
                    </template>
                </v-tooltip>
                <span class="text-body-1">{{ $t('n_skins', collection.size) }}</span>
                <CopyBtn :text="'https://mineskin.org/collections/' + collection.uuid" size="small" content-key="collection_url"/>
                <template v-if="collection.owned">
                    <CollectionEditDialog :collection="collection" :limits="limits" @saved="collection = $event">
                        <template #default="{ props }">
                            <v-btn
                                v-bind="props"
                                color="surface-variant"
                                icon="mdi-pencil"
                                variant="text"
                                density="compact"
                                :aria-label="$t('Edit collection')"
                            />
                        </template>
                    </CollectionEditDialog>
                    <v-btn
                        color="error"
                        icon="mdi-delete"
                        variant="text"
                        density="compact"
                        :aria-label="$t('Delete collection')"
                        @click="confirmText = ''; deleteDialog = true"
                    />
                </template>
            </h2>
            <v-alert v-if="collection.owned && limits && collection.size >= limits.skins" color="primary" variant="tonal" icon="mdi-information" class="mt-4">
                <template #text>
                    <action-link
                        href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=collection_size"
                        target="_blank"
                        class="upgrade-text-gradient"
                    >
                        {{ $t('✨ Upgrade') }}
                    </action-link>
                    {{ $t('for bigger collections') }}
                </template>
            </v-alert>
            <v-infinite-scroll :items="skins" :onLoad="load" style="overflow: hidden">
                <v-row justify="center" dense>
                    <template v-for="item in skins" :key="item.uuid">
                        <v-col
                            cols="5"
                            xs="5"
                            sm="3"
                            md="2"
                            lg="2"
                            xl="1"
                            class="gallery-item-group ma-2"
                        >
                            <skin-link-card :skin="item"/>
                            <v-btn
                                v-if="collection.owned"
                                icon="mdi-close"
                                variant="text"
                                size="small"
                                :aria-label="$t('Remove from collection')"
                                :disabled="!!removing"
                                :loading="removing === item.uuid"
                                @click="removeSkin(item.uuid)"
                            />
                        </v-col>
                    </template>
                </v-row>
                <template v-slot:empty>
                    <div class="text-center">{{ $t('No more results') }}</div>
                </template>
            </v-infinite-scroll>
            <v-dialog v-if="collection.owned" v-model="deleteDialog" max-width="600">
                <v-card :title="$t('Delete collection?')">
                    <v-card-text>
                        <v-row>
                            <v-col>
                                {{ $t('Are you sure you want to delete this collection? This action is irreversible.') }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="confirmText"
                                    :label="$t('Type delete to confirm deletion')"
                                    density="compact"
                                    required
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            :text="$t('Confirm Deletion')"
                            color="error"
                            variant="text"
                            :disabled="!confirmed || deleting"
                            :loading="deleting"
                            @click="deleteCollection"
                        />
                        <v-spacer/>
                        <v-btn :text="$t('Cancel')" variant="text" @click="deleteDialog = false"/>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </v-container>
</template>
<script setup lang="ts">
import { SkinVisibility2 } from "@mineskin/types";
import type { CollectionListResponse, ListedCollection } from "~/types/Collection";
import type { ListedSkin } from "~/types/SkinListResponse";
import CollectionEditDialog from "~/components/collection/CollectionEditDialog.vue";
import CopyBtn from "~/components/CopyBtn.vue";
import ActionLink from "~/components/ActionLink.vue";

definePageMeta({
    key: route => route.params.collection as string
});

const {$mineskin, $flags} = useNuxtApp();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const authStore = useAuthStore();
const collectionId = route.params.collection as string;

const {
    data: collection,
    status: collectionStatus
} = useLazyAsyncData<ListedCollection | null>(`collection-${ collectionId }`, async () => {
    await authStore.checkAuth();
    if (!$flags.hasFeature('web.collections')) return null;
    const res = await $mineskin.collections.get(collectionId);
    return res?.success ? res.collection : null;
}, {server: false});

const collectionNotFound = computed(() => !collection.value && (collectionStatus.value === 'success' || collectionStatus.value === 'error'));
const {data: collectionsRes} = useLazyAsyncData<CollectionListResponse | null>(`collection-limits-${ collectionId }`, async () => {
    if (!$flags.hasFeature('web.collections') || !collection.value?.owned) return null;
    return await $mineskin.me.collections();
}, {
    server: false,
    watch: [() => collection.value?.owned]
});
const limits = computed(() => collectionsRes.value?.success ? collectionsRes.value.limits : undefined);

useHead({title: computed(() => collection.value?.name)});

const skins = ref<ListedSkin[]>([]);
const after = ref<string>();
const hasNext = ref(true);

async function load({done}: { done: (status: 'ok' | 'empty' | 'error') => void }) {
    if (!collection.value || !hasNext.value || !$flags.hasFeature('web.collections')) {
        done('empty');
        return;
    }
    const res = await $mineskin.collections.skins(collectionId, after.value, 16);
    if (!res?.success) {
        done('error');
        return;
    }
    skins.value.push(...res.skins);
    after.value = res.pagination.next.after;
    hasNext.value = !!after.value;
    done(hasNext.value ? 'ok' : 'empty');
}

const removing = ref<string>();
async function removeSkin(skin: string) {
    if (!collection.value?.owned || removing.value) return;
    removing.value = skin;
    try {
        const res = await $mineskin.collections.removeSkin(collectionId, skin);
        if (res?.success) {
            skins.value = skins.value.filter(s => s.uuid !== skin);
            if (res.removed) {
                collection.value.size--;
            }
        }
    } finally {
        removing.value = undefined;
    }
}

const deleteDialog = ref(false);
const confirmText = ref('');
const confirmed = computed(() => confirmText.value.toLowerCase() === 'delete');
const deleting = ref(false);

async function deleteCollection() {
    if (!confirmed.value || !collection.value?.owned || deleting.value) return;
    deleting.value = true;
    try {
        const res = await $mineskin.collections.delete(collectionId);
        if (res?.success) {
            deleteDialog.value = false;
            await router.push(localePath('/my-skins'));
        }
    } finally {
        deleting.value = false;
    }
}
</script>
