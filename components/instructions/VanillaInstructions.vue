<style>
pre.instructions{
    white-space: pre-wrap;
}
</style>
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
import type { SkinInfo2 } from "@mineskin/types";
import VanillaCommand from "~/components/instructions/vanilla/VanillaCommand.vue";
const props = defineProps<{
    skin: SkinInfo2;
}>();
const versions = [12, 13, 16];
const version = ref(16);
</script>