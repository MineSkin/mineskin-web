<template>
    <div class="d-flex flex-row">
        <v-tabs
            v-model="version"
            color="primary"
            direction="vertical"
            class="mr-2"
        >
            <v-tab text="1.21.5+" :value="215"></v-tab>
            <v-tab text="1.21" :value="21"></v-tab>
            <v-tab text="1.16" :value="16"></v-tab>
            <v-tab text="1.13" :value="13"></v-tab>
            <v-tab text="1.12" :value="12"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="version"  direction="vertical" class="w-100" >
            <v-tabs-window-item v-for="v in versions" :key="v" :value="v">
                <div>
                    <VanillaCommand :skin="skin" :version="v"/>
                </div>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { ref } from "vue";
import VanillaCommand from "./vanilla/VanillaCommand.vue";
const props = defineProps<{
    skin: SkinInfo2;
}>();
const versions = [12, 13, 16, 21, 215];
const version = ref(215);
</script>