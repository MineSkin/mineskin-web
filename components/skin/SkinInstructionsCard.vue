<style>
.instructions-text-container {
    min-height: 175px;
}
pre.instructions {
    display: none;
}
</style>
<template>
    <v-card min-height="260">
        <v-tabs
            bg-color="primary"
            v-model="instructionsTab"
        >
            <v-tab value="vanilla">{{ $t("Vanilla") }}</v-tab>
            <v-tab value="plugins">{{ $t("Plugins/Mods") }}</v-tab>
            <v-tab value="code">{{ $t("Code") }}</v-tab>
        </v-tabs>
        <v-card-text>
            <v-tabs-window v-model="instructionsTab" class="instructions-window">
                <v-tabs-window-item value="vanilla">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <VanillaInstructions v-else :skin="skin"/>
                        <v-divider class="mt-2"/>
                        <div class="pt-2">
                            <v-icon icon="mdi-information-outline" color="secondary"/>
                            {{ $t("Use these in a command block to give yourself a player head") }}
                        </div>
                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="plugins">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <PluginInstructions v-else :skin="skin"/>
                        <v-divider class="mt-2"/>
                        <div class="pt-2">
                            <v-icon icon="mdi-information-outline" color="secondary"/>
                            {{ $t("Use these with supported plugins to change skins etc.") }}
                        </div>
                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="code">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <SkinCodeInstructions v-else :skin="skin"/>
                        <v-divider class="mt-2"/>
                        <div class="pt-2">
                            <v-icon icon="mdi-information-outline" color="secondary"/>
                            {{ $t("Use these in your code to directly access the skin data") }}
                        </div>
                    </div>
                </v-tabs-window-item>

            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { ref } from "vue";
import SkinCodeInstructions from "../instructions/SkinCodeInstructions.vue";
import PluginInstructions from "../instructions/PluginInstructions.vue";
import VanillaInstructions from "../instructions/VanillaInstructions.vue";

const props = defineProps<{
    skin: SkinInfo2;
}>();

const instructionsTab = ref('vanilla');
</script>