<template>
    <component :is="format">
        <template v-slot:skinUuid>{{ skin.uuid }}</template>
    </component>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import CitizensFormat from "~/components/instructions/plugin/CitizensFormat.vue";
import TaterzensFormat from "~/components/instructions/plugin/TaterzensFormat.vue";
import InstructionsPre from "~/components/instructions/InstructionsPre.vue";

const props = defineProps<{
    skin: SkinInfo2;
    type: 'citizens'|'taterzens'
}>();
const format = computed(() => {
    switch (props.type) {
        case 'citizens':
            return CitizensFormat;
        case 'taterzens':
            return TaterzensFormat;
    }
})
</script>