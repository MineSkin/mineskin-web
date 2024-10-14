<template>
    <div>
        <VanillaCommand :skin="skin" :version="version"/>
        <v-select
            v-model="version"
            :items="versions"
            label="Version"
            outlined
            dense></v-select>
    </div>
</template>
<script setup lang="ts">
import VanillaCommand from "~/components/instructions/VanillaCommand.vue";
import type { SkinInfo2 } from "@mineskin/types";
const props = defineProps<{
    skin: SkinInfo2;
}>();
const versions = [12, 13, 16];
const version = ref(16);
</script>