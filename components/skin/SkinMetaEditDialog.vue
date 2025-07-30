<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                icon="mdi-pencil"
                variant="text"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <NameInput v-model="name" hide-variables/>
                    <VisibilitySelect v-model="visibility"/>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text="Apply"
                        @click="apply"
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

const {$mineskin} = useNuxtApp();

const props = defineProps<{
    skin: SkinInfo2
}>()

const prevName = ref<string>(props.skin.name || '');
const prevVisibility = ref<SkinVisibility2>(props.skin.visibility);

const name = ref<string>(props.skin.name || '');
const visibility = ref<SkinVisibility2>(props.skin.visibility);

const apply = async () => {
    if (name.value !== prevName.value) {
        await $mineskin.skins.update(props.skin.uuid, {name: name.value});
    }
    if (visibility.value !== prevVisibility.value) {
        await $mineskin.skins.update(props.skin.uuid, {visibility: visibility.value});
    }
}
</script>