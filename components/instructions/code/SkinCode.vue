<template>
    <component :is="format">
        <template v-slot:skinValue>{{ skin.texture.data.value }}</template>
        <template v-slot:skinSignature>{{ skin.texture.data.signature }}</template>
        <template v-slot:uuidString>{{ addUuidDashes(skin.uuid) }}</template>
        <template v-slot:skinUuid>{{ skin.uuid }}</template>
        <template v-slot:skinName>{{ skinName(skin) }}</template>
        <template v-slot:skinShortId>{{ skin.uuid.substring(0, 8) }}</template>
        <template v-slot:skinDate>{{ new Date(skin.generator.timestamp).toISOString() }}</template>
    </component>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import CodeFormatPaper from "~/components/instructions/code/CodeFormatPaper.vue";
import { addUuidDashes, skinName } from "../../../util/skin";
import CodeFormatMojang from "~/components/instructions/code/CodeFormatMojang.vue";
import InstructionsPre from "~/components/instructions/InstructionsPre.vue";

const props = defineProps<{
    skin: SkinInfo2;
    type: 'paper'|'mojang'
}>();
const format = computed(() => {
    switch (props.type) {
        case 'paper':
            return CodeFormatPaper;
        case 'mojang':
            return CodeFormatMojang;
    }
})
</script>