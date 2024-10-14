<template>
    <v-card min-height="250">
        <v-tabs
            bg-color="secondary"
            v-model="instructionsTab"
        >
            <v-tab value="vanilla">Vanilla</v-tab>
            <v-tab value="plugins">Plugins/Mods</v-tab>
            <v-tab value="code">Code</v-tab>
        </v-tabs>
        <v-card-text>
            <v-tabs-window v-model="instructionsTab">
                <v-tabs-window-item value="vanilla">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <VanillaInstructions v-else :skin="skin"/>
                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="plugins">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <PluginInstructions v-else :skin="skin"/>
                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="code">
                    <div>
                        <v-skeleton-loader v-if="!skin" type="paragraph"/>
                        <SkinCodeInstructions v-else :skin="skin"/>
                    </div>
                </v-tabs-window-item>

            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import SkinCodeInstructions from "~/components/instructions/SkinCodeInstructions.vue";
import PluginInstructions from "~/components/instructions/PluginInstructions.vue";
import VanillaInstructions from "~/components/instructions/VanillaInstructions.vue";
import type { SkinInfo2 } from "@mineskin/types";

const props = defineProps<{
    skin: SkinInfo2;
}>();

const instructionsTab = ref('vanilla');
</script>