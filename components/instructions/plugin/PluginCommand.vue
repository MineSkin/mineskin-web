<template>
    <div class="instructions-text-container">
        <copy-text-field
            location="prepend"
             :content-key="'instructions_plugin_'+type"
            :value="getText()"
            readonly width="100%"/>
        <component :is="format" ref="formatted">
            <template v-slot:skinUuid>{{ skin.uuid }}</template>
        </component>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { computed } from "vue";
import CitizensFormat from "./CitizensFormat.vue";
import TaterzensFormat from "./TaterzensFormat.vue";
import CopyTextArea from "~/components/skin/CopyTextArea.vue";
import CopyTextField from "~/components/skin/CopyTextField.vue";

const props = defineProps<{
    skin: SkinInfo2;
    type: 'citizens' | 'taterzens'
}>();
const format = computed(() => {
    switch (props.type) {
        case 'citizens':
            return CitizensFormat;
        case 'taterzens':
            return TaterzensFormat;
    }
});

const formatted = useTemplateRef("formatted");
const getText = () => {
    return (formatted.value?.$el?.nextSibling as HTMLPreElement)?.innerText || '';
}
</script>