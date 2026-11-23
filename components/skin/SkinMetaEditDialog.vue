<template>
    <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-tooltip :text="$t('Edit Skin')" location="bottom">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                        v-bind="mergeProps(activatorProps, tooltipProps)"
                        color="surface-variant"
                        :icon="!!editFail ? 'mdi-pencil-off' : 'mdi-pencil'"
                        variant="text"
                        density="compact"
                        :aria-label="$t('Edit Skin')"
                    ></v-btn>
                </template>
            </v-tooltip>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="$t('Edit Skin')">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <div v-if="!!editFail">
                                <div>
                                    {{ editFailClean }}
                                </div>
                                <div class="mt-2"
                                     v-if="editFail === 'edit_duration_expired' && (user?.grants?.skin_edit_duration || 0) < 12">
                                    <action-link
                                        href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=skin_edit_duration"
                                        target="_blank"
                                        class="upgrade-text-gradient"
                                    >
                                        {{ $t("✨ Upgrade") }}
                                    </action-link>
                                    {{ $t("to edit skins for longer") }}
                                </div>
                            </div>
                            <div v-else>
                                <NameInput v-model="name" hide-variables/>
                                <VisibilitySelect v-model="visibility"/>

                                <v-btn
                                    color="primary"
                                    :text="$t('Update Skin')"
                                    @click="apply"
                                    :disabled="!!editFail||saving||!changed"
                                    :loading="saving"
                                ></v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider class="my-4"/>
                    <v-row>
                        <v-col>
                            <div v-if="!!deleteFail">
                                <div>
                                    {{ deleteFailClean }}*
                                </div>
                                <div class="mt-2"
                                     v-if="deleteFail === 'delete_duration_expired' && (user?.grants?.skin_delete_duration || 0) < 12">
                                    <action-link
                                        href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=skin_delete_duration"
                                        target="_blank"
                                        class="upgrade-text-gradient"
                                    >
                                        {{ $t("✨ Upgrade") }}
                                    </action-link>
                                    {{ $t("to delete skins for longer") }}
                                </div>
                                <div>
                                    <span class="text-body-2 text-medium-emphasis">*{{ $t("You can always manually request deletion of your skin.") }}</span>
                                </div>
                            </div>
                            <div class="mt-2">
                                <SkinDeleteConfirmDialog :skin="skin" :can-delete="canDelete"/>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        :text="$t('Cancel')"
                        variant="text"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import { mergeProps } from "vue";
import type { SkinInfo2, SkinVisibility2 } from "@mineskin/types";
import NameInput from "~/components/generate/options/NameInput.vue";
import VisibilitySelect from "~/components/generate/options/VisibilitySelect.vue";
import { storeToRefs } from "pinia";
import SkinDeleteConfirmDialog from "~/components/skin/SkinDeleteConfirmDialog.vue";
import ActionLink from "~/components/ActionLink.vue";

const {$mineskin, $notify} = useNuxtApp();
const {t: $t} = useI18n();

const dialog = ref(false);

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const props = defineProps<{
    skin: SkinInfo2,
    canEdit: boolean,
    canDelete: boolean,
    editFail?: string,
    deleteFail?: string
}>();

const emit = defineEmits<{
    (event: 'update:skin', skin: SkinInfo2): void
}>();

const editFailClean = computed(() => {
    if (!props.editFail) return null;
    switch (props.editFail) {
        case 'edit_duration_expired': {
            if (user.value?.grants?.skin_edit_duration) {
                return $t('You can only edit skins for {hours} hours after upload', {hours: user.value.grants.skin_edit_duration});
            }
            return $t('You can no longer edit this skin');
        }
        case 'max_edits_reached': {
            return $t('You have reached the maximum number of edits for this skin');
        }
    }
    return props.editFail;
});
const deleteFailClean = computed(() => {
    if (!props.deleteFail) return null;
    switch (props.deleteFail) {
        case 'delete_duration_expired': {
            if (user.value?.grants?.skin_delete_duration) {
                return $t('You can only delete skins for {hours} hours after upload', {hours: user.value.grants.skin_delete_duration});
            }
            return $t('You can no longer delete this skin');
        }
    }
    return props.deleteFail;
})

const prevName = ref<string>(props.skin.name || '');
const prevVisibility = ref<SkinVisibility2>(props.skin.visibility);

const name = ref<string>(props.skin.name || '');
const visibility = ref<SkinVisibility2>(props.skin.visibility);

// "Update Skin" stays disabled until there is something to save, instead of silently doing nothing
const changed = computed(() => name.value !== prevName.value || visibility.value !== prevVisibility.value);

const saving = ref(false);
const apply = async () => {
    if (saving.value) return;
    if (!changed.value) return;
    saving.value = true;
    try {
        let allSucceeded = true;
        if (name.value !== prevName.value) {
            const res = await $mineskin.skins.update(props.skin.uuid, {name: name.value});
            if (res.success) {
                prevName.value = name.value;
                emit('update:skin', {
                    ...props.skin,
                    name: name.value
                });
            } else {
                allSucceeded = false;
            }
        }
        if (visibility.value !== prevVisibility.value) {
            const res = await $mineskin.skins.update(props.skin.uuid, {visibility: visibility.value});
            if (res.success) {
                prevVisibility.value = visibility.value;
                emit('update:skin', {
                    ...props.skin,
                    visibility: visibility.value
                });
            } else {
                allSucceeded = false;
            }
        }
        if (allSucceeded) {
            $notify({
                text: $t('Skin updated'),
                color: 'success'
            });
            dialog.value = false;
        }
    } catch (e) {
        console.error(e);
        $notify({
            text: $t('Failed to update skin. Please try again.'),
            color: 'error'
        });
    } finally {
        saving.value = false;
    }
}
</script>