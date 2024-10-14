<template>
    <component :is="format">
        <template v-slot:skinValue>{{ skin.texture.data.value }}</template>
        <template v-slot:skinSignature>{{ skin.texture.data.signature }}</template>
        <template v-slot:skinUuid>{{ skin.uuid }}</template>
        <template v-slot:uuidString>{{ addUuidDashes(skin.uuid) }}</template>
        <template v-slot:uuidArray>{{ formatInt32UUID(getInt32ForUUID(skin.uuid)) }}</template>
        <template v-slot:skinName>{{ skinName(skin) }}</template>
        <template v-slot:skinShortId>{{ skin.uuid.substring(0, 8) }}</template>
        <template v-slot:skinDate>{{ new Date(skin.generator.timestamp).toISOString() }}</template>
    </component>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import VanillaFormat12 from "~/components/instructions/vanilla/VanillaFormat12.vue";
import VanillaFormat13 from "~/components/instructions/vanilla/VanillaFormat13.vue";
import VanillaFormat16 from "~/components/instructions/vanilla/VanillaFormat16.vue";
import { addUuidDashes, formatInt32UUID, getInt32ForUUID, skinName } from "../../../util/skin";
import InstructionsPre from "~/components/instructions/InstructionsPre.vue";

const props = defineProps<{
    skin: SkinInfo2;
    version: 12 | 13 | 16;
}>();
const format = computed(() => {
    switch (props.version) {
        case 12:
            return VanillaFormat12;
        case 13:
            return VanillaFormat13;
        case 16:
            return VanillaFormat16;
    }
})
</script>