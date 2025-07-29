<template>
    <v-text-field
        label="Name (optional)"
        v-model="name"
        :rules="nameRules"
        persistent-hint
    >
        <template v-slot:details v-if="!hideVariables">
                            <span>Optional name for this skin, supports variables <a
                                @click.prevent="variablesDialog=true"
                                href="#">
                                <v-icon icon="mdi-help-circle"/></a></span>
        </template>
    </v-text-field>
    <v-dialog
        v-if="isHydrated"
        v-model="variablesDialog"
        width="auto"
    >
        <v-card
            max-width="400"
            prepend-icon="mdi-help-circle"
            title="Variables / Placeholders"
        >
            <template v-slot:text>
                <div>Names support variables that will get replaced with the matching values when you generate a skin.
                    This is especially useful when generating multiple skins at once.
                </div>
                <br/>
                <div>
                    <b>Available variables:</b><br/>
                    <ul>
                        <li><b>{index}</b> - The index of the image in the list</li>
                        <li><b>{user}</b> - The name/UUID of the user</li>
                        <li><b>{file}</b> - The file name (also works for URLs)</li>
                    </ul>
                </div>
                <br/>
                <div>
                    <b>Preview:</b><br/>
                    <span v-if="replacedNamesPreview.length<=0">Enter a name first</span>
                    <ul>
                        <li v-for="name in replacedNamesPreview">{{ name }}</li>
                    </ul>
                </div>
            </template>
            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Ok"
                    @click="variablesDialog = false"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { useGenerateStore } from "~/stores/generate";
import { storeToRefs } from "pinia";
import { useQueueStore } from "~/stores/queue";
import { useSettingsStore } from "~/stores/settings";
import { computed, ref } from "vue";
import { GenerateType } from "@mineskin/types";
import { processNameVariables } from "~/util/misc";

const generateStore = useGenerateStore();
const {
    uploadFiles,
    urls,
    users,
} = storeToRefs(generateStore);

const nameRules = [
    (v: string) => v.length <= 24 || 'Max 24 characters',
    (v: string) => /^[a-zA-Z0-9_.\-{} ]*$/g.test(v) || 'Only a-z, 0-9, _-.{} allowed'
];

const props = defineProps<{
    generateType?: GenerateType,
    imageCount?: number,
    hideVariables?: boolean
}>()

const isHydrated = ref(false);

const variablesDialog = ref(false);

const replacedNamesPreview = computed(() => {
    return Array.from({length: props.imageCount || 0}, (_, i) => {
        return processNameVariables(name.value, props.generateType!, i, urls.value[i] || null, uploadFiles.value[i] || null, users.value[i] || null);
    }).filter(name => name.length > 0);
});

onMounted(() => {
    isHydrated.value = true;
});

const name = defineModel<string>({required: true});
</script>