<template>
    <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <slot :props="activatorProps"/>
        </template>
        <v-card :title="collection ? $t('Edit collection') : $t('New collection')">
            <v-form @submit.prevent="apply">
                <v-card-text>
                    <v-text-field
                        v-model="name"
                        :label="$t('Name')"
                        :rules="nameRules"
                        :maxlength="48"
                        required
                    />
                    <v-select
                        v-model="visibility"
                        :label="$t('Visibility')"
                        :items="visibilities"
                        :item-props="visibilityProps"
                    />
                    <v-btn
                        color="primary"
                        type="submit"
                        :text="collection ? $t('Save collection') : $t('Create collection')"
                        :disabled="!validName || saving"
                        :loading="saving"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn :text="$t('Cancel')" variant="text" @click="dialog = false"/>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { SkinVisibility2 } from "@mineskin/types";
import type { CollectionLimits, ListedCollection } from "~/types/Collection";

const {$mineskin} = useNuxtApp();
const {t: $t} = useI18n();

const props = defineProps<{
    collection?: ListedCollection,
    limits?: CollectionLimits
}>();

const emit = defineEmits<{
    (event: 'saved', collection: ListedCollection): void
}>();

const dialog = defineModel<boolean>({default: false});
const name = ref('');
const visibility = ref<SkinVisibility2>(SkinVisibility2.PUBLIC);
const saving = ref(false);
const validName = computed(() => !!name.value && name.value.length <= 48 && !/[^a-zA-Z0-9_.\- ]/.test(name.value));
const nameRules = [
    () => validName.value || $t('Use 1–48 characters: a-z, A-Z, 0-9, _, ., -, or spaces.')
];
const visibilities = [SkinVisibility2.PUBLIC, SkinVisibility2.UNLISTED, SkinVisibility2.PRIVATE];

watch(dialog, (value) => {
    if (!value) return;
    name.value = props.collection?.name || '';
    visibility.value = props.collection?.visibility || SkinVisibility2.PUBLIC;
});

function visibilityProps(item: SkinVisibility2) {
    switch (item) {
        case SkinVisibility2.PUBLIC:
            return {
                prependIcon: "mdi-earth",
                title: $t("Public"),
                subtitle: $t("Visible to everyone")
            };
        case SkinVisibility2.UNLISTED:
            return {
                prependIcon: "mdi-link",
                title: $t("Unlisted"),
                subtitle: $t("Visible to anyone with the link")
            };
        case SkinVisibility2.PRIVATE:
            return {
                prependIcon: "mdi-eye-off",
                appendIcon: props.limits?.private !== true ? 'mdi-lock' : '',
                title: props.limits?.private === true ? $t("Private ✨") : $t("Private ✨ - Requires Subscription"),
                subtitle: $t("Visible to you only"),
                disabled: props.limits?.private !== true
            };
    }
}

async function apply() {
    if (!validName.value || saving.value) return;
    saving.value = true;
    try {
        const data = {name: name.value, visibility: visibility.value};
        const res = props.collection
            ? await $mineskin.collections.update(props.collection.uuid, data)
            : await $mineskin.collections.create(data);
        if (res?.success) {
            emit('saved', res.collection);
            dialog.value = false;
        }
    } finally {
        saving.value = false;
    }
}
</script>
