<template>
    <div class="instructions-text-container">
        <copy-text-area
            location="prepend"
            :content-key="'instructions_vanilla_'+version"
            :value="getText()"
            readonly width="100%"/>
        <component :is="format" ref="formatted">
            <template v-slot:skinValue>{{ skin.texture.data.value }}</template>
            <template v-slot:skinSignature>{{ skin.texture.data.signature }}</template>
            <template v-slot:skinUuid>{{ skin.uuid }}</template>
            <template v-slot:uuidString>{{ addUuidDashes(skin.uuid) }}</template>
            <template v-slot:uuidArray>{{ formatInt32UUID(getInt32ForUUID(skin.uuid)) }}</template>
            <template v-slot:skinName>{{ skinName(skin) }}</template>
            <template v-slot:skinShortId>{{ skin.uuid.substring(0, 8) }}</template>
            <template v-slot:skinDate>{{ new Date(skin.generator.timestamp).toUTCString() }}</template>
        </component>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { addUuidDashes, formatInt32UUID, getInt32ForUUID, skinName } from "../../../util/skin";
import VanillaFormat12 from "./VanillaFormat12.vue";
import VanillaFormat13 from "./VanillaFormat13.vue";
import VanillaFormat16 from "./VanillaFormat16.vue";
import CopyTextArea from "~/components/skin/CopyTextArea.vue";
import CopyTextField from "~/components/skin/CopyTextField.vue";
import VanillaFormat21 from "~/components/instructions/vanilla/VanillaFormat21.vue";

const props = defineProps<{
    skin: SkinInfo2;
    version: 12 | 13 | 16 | 21;
}>();
const format = computed(() => {
    switch (props.version) {
        case 12:
            return VanillaFormat12;
        case 13:
            return VanillaFormat13;
        case 16:
            return VanillaFormat16;
        case 21:
            return VanillaFormat21;
    }
});

const formatted = useTemplateRef("formatted");
const getText = () => {
    return (formatted.value?.$el?.nextSibling as HTMLPreElement)?.innerText || '';
}

</script>