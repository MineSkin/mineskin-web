<style>
pre.instructions {
    white-space: pre-wrap;
}
</style>
<template>
    <div class="d-flex flex-row">
        <v-tabs
            v-model="type"
            color="primary"
            direction="vertical"
            class="mr-2"
        >
            <v-tab text="Citizens" value="citizens"></v-tab>
            <v-tab text="Taterzens" value="taterzens"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="type">
            <v-tabs-window-item v-for="t in types" :key="t" :value="t">
                <div>
                    <PluginCommand :skin="skin" :type="t"/>
                </div>
            </v-tabs-window-item>
        </v-tabs-window>
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
const types = ['citizens', 'taterzens'];
const type = ref('citizens');
</script>