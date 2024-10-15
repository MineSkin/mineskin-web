<template>
    <component :is="format">
        <template v-slot:skinUuid>{{ skin.uuid }}</template>
    </component>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { computed } from "vue";
import CitizensFormat from "./CitizensFormat.vue";
import TaterzensFormat from "./TaterzensFormat.vue";

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