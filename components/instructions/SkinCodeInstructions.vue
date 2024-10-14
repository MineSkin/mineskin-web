<style>
pre.instructions{
    white-space: pre-wrap;
}
</style>
<template>
    <div>
        <SkinCode :skin="skin" :type="type"/>
        <v-select
            v-model="type"
            :items="types"
            label="Type"
            outlined
            dense></v-select>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import VanillaCommand from "~/components/instructions/vanilla/VanillaCommand.vue";
import SkinCode from "~/components/instructions/code/SkinCode.vue";
const props = defineProps<{
    skin: SkinInfo2;
}>();
const types = ['paper','mojang'];
const type = ref('paper');
</script>