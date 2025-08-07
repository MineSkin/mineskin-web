<template>
    <v-dialog v-model="dialog">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                color="error"
                variant="text"
                density="compact"
                :disabled="!props.canDelete || !!deleteFail"
                prepend-icon="mdi-delete"
            >
                Delete Skin
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Delete Skin?">

                <v-card-text>
                    <v-row>
                        <v-col>
                            <div>
                                Are you sure you want to delete this skin? This action is irreversible and will remove
                                the
                                skin from your account permanently.
                                <br/>
                                Alternatively, you can set the visibility to "Private" or "Unlisted" to hide the skin
                                from
                                public view without deleting it.
                            </div>
                            <div>
                                Please type <strong>delete</strong> in the field below to confirm deletion.
                                <v-text-field v-model="confirmText" required></v-text-field>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        text="Confirm Deletion"
                        variant="text"
                        :disabled="!confirmed"
                        @click="actuallyDelete()"
                    ></v-btn>

                    <v-spacer></v-spacer>

                    <v-btn
                        text="Cancel"
                        variant="text"
                        @click="dialog = false"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { storeToRefs } from "pinia";

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const props = defineProps<{
    skin: SkinInfo2,
    canDelete: boolean,
    deleteFail?: string
}>();

const dialog = ref(false);

const confirmText = ref('');
const confirmed = computed(() => {
    return confirmText.value.toLowerCase() === 'delete';
});


const actuallyDelete = async () => {
    if (!confirmed.value) return;
    if (!props.canDelete) return;
    if (!user) return;

    const res = await $mineskin.skins.delete(props.skin.uuid);
    if (res.success) {
        dialog.value = false;
    }
}

</script>