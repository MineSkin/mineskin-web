<template>
    <div>
        <v-btn
            color="error"
            variant="text"
            :disabled="!props.canDelete || !!deleteFail"
            prepend-icon="mdi-delete"
            @click="dialog = true"
        >
            {{ $t("Delete Skin") }}
        </v-btn>
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:default="{ isActive }">
                <v-card :title="$t('Delete Skin?')">
                    <v-card-text>
                        <v-row>
                            <v-col>
                                {{ $t("Are you sure you want to delete this skin? This action is irreversible and will remove the skin from your account permanently.") }}
                                <br/>
                                {{ $t('Alternatively, you can set the visibility to "Private" or "Unlisted" to hide the skin from public view without deleting it.') }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="confirmText"
                                    :label="$t('Type delete to confirm deletion')"
                                    density="compact"
                                    autofocus
                                    autocomplete="off"
                                    hide-details
                                    required
                                    @keydown.enter="actuallyDelete()"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            :text="$t('Confirm Deletion')"
                            color="error"
                            variant="text"
                            :disabled="!confirmed||deleting"
                            :loading="deleting"
                            @click="actuallyDelete()"
                        ></v-btn>

                        <v-spacer></v-spacer>

                        <v-btn
                            :text="$t('Cancel')"
                            variant="text"
                            @click="dialog = false"
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { storeToRefs } from "pinia";

const {$mineskin, $notify} = useNuxtApp();
const {t: $t} = useI18n();
const localePath = useLocalePath();

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const router = useRouter();

const props = defineProps<{
    skin: SkinInfo2,
    canDelete: boolean,
    deleteFail?: string
}>();

const dialog = ref(false);

const confirmText = ref('');
const confirmed = computed(() => {
    return confirmText.value.trim().toLowerCase() === 'delete';
});


const deleting = ref(false);
const actuallyDelete = async () => {
    if (!confirmed.value) return;
    if (!props.canDelete) return;
    if (!user) return;
    if (deleting.value) return;

    deleting.value = true;
    try {
        const res = await $mineskin.skins.delete(props.skin.uuid);
        if (res.success) {
            confirmText.value = '';
            dialog.value = false;
            router.push(localePath('/my-skins'));
        } else {
            $notify({
                text: $t('Failed to delete skin. Please try again.'),
                color: 'error'
            });
        }
    } catch (e) {
        console.error(e);
        $notify({
            text: $t('Failed to delete skin. Please try again.'),
            color: 'error'
        });
    } finally {
        deleting.value = false;
    }
}

</script>