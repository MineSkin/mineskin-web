<template>
    <div>
        <copy-text-area :value="getText()" readonly width="100%"/>
        <component :is="format" ref="formatted">
            <template v-slot:skinValue>{{ skin.texture.data.value }}</template>
            <template v-slot:skinSignature>{{ skin.texture.data.signature }}</template>
            <template v-slot:uuidString>{{ addUuidDashes(skin.uuid) }}</template>
            <template v-slot:skinUuid>{{ skin.uuid }}</template>
            <template v-slot:skinName>{{ skinName(skin) }}</template>
            <template v-slot:skinShortId>{{ skin.uuid.substring(0, 8) }}</template>
            <template v-slot:skinDate>{{ new Date(skin.generator.timestamp).toUTCString() }}</template>
        </component>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { addUuidDashes, skinName } from "../../../util/skin";
import CodeFormatPaper from "./CodeFormatPaper.vue";
import CodeFormatMojang from "./CodeFormatMojang.vue";
import { computed } from "vue";
import CopyTextArea from "~/components/skin/CopyTextArea.vue";

const props = defineProps<{
    skin: SkinInfo2;
    type: 'paper' | 'mojang'
}>();
const format = computed(() => {
    switch (props.type) {
        case 'paper':
            return CodeFormatPaper;
        case 'mojang':
            return CodeFormatMojang;
    }
});

const formatted = useTemplateRef("formatted");
const getText = () => {
    return (formatted.value?.$el?.nextSibling as HTMLPreElement)?.innerText || '';
}
</script>