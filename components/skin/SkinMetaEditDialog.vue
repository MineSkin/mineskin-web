<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                :icon="!!editFail ? 'mdi-pencil-off' : 'mdi-pencil'"
                variant="text"
                density="compact"
                v-tooltip:end="editFailClean||false"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Edit Skin">
                <v-card-text>
                    <div v-if="!!editFail">
                        <div>
                            {{ editFailClean }}
                        </div>
                        <div v-if="editFail === 'edit_duration_expired' && user?.grants?.skin_edit_duration || 0 < 12">
                            <a class="text-decoration-none"
                               href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=skin_edit_duration"
                               target="_blank">
                                Upgrade to edit skins for longer
                            </a>
                        </div>
                    </div>
                    <div v-else>
                        <NameInput v-model="name" hide-variables/>
                        <VisibilitySelect v-model="visibility"/>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text="Apply"
                        @click="apply"
                        :disabled="!!editFail"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import type { SkinInfo2, SkinVisibility2 } from "@mineskin/types";
import NameInput from "~/components/generate/options/NameInput.vue";
import VisibilitySelect from "~/components/generate/options/VisibilitySelect.vue";
import { storeToRefs } from "pinia";

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const props = defineProps<{
    skin: SkinInfo2,
    editFail?: string
}>();

const emit = defineEmits<{
    (event: 'update:skin', skin: SkinInfo2): void
}>();

const editFailClean = computed(() => {
    if (!props.editFail) return null;
    switch (props.editFail) {
        case 'edit_duration_expired': {
            if (user.value?.grants?.skin_edit_duration) {
                return `You can only edit skins for ${ user.value.grants.skin_edit_duration } hours after upload`;
            }
            return 'You can no longer edit this skin';
        }
        case 'max_edits_reached': {
            return 'You have reached the maximum number of edits for this skin';
        }
    }
    return props.editFail;
})

const prevName = ref<string>(props.skin.name || '');
const prevVisibility = ref<SkinVisibility2>(props.skin.visibility);

const name = ref<string>(props.skin.name || '');
const visibility = ref<SkinVisibility2>(props.skin.visibility);

const apply = async () => {
    if (name.value !== prevName.value) {
        const res = await $mineskin.skins.update(props.skin.uuid, {name: name.value});
        if (res.success) {
            prevName.value = name.value;
            props.skin.name = name.value;
            emit('update:skin', {
                ...props.skin,
                name: name.value
            });
        }
    }
    if (visibility.value !== prevVisibility.value) {
        const res = await $mineskin.skins.update(props.skin.uuid, {visibility: visibility.value});
        if (res.success) {
            prevVisibility.value = visibility.value;
            props.skin.visibility = visibility.value;
            emit('update:skin', {
                ...props.skin,
                visibility: visibility.value
            });
        }
    }
}
</script>