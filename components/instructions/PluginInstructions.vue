<template>
    <div>
        <PluginCommand :skin="skin" :type="type"/>
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
import PluginCommand from "~/components/instructions/plugin/PluginCommand.vue";
const props = defineProps<{
    skin: SkinInfo2;
}>();
const types = ['citizens','taterzens'];
const type = ref('citizens');
</script>