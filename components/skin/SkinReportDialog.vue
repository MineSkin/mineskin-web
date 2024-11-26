<template>
    <div class="pa-4 text-center">
        <v-dialog
            v-model="dialog"
            max-width="400"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    v-if="authed"
                    color="error"
                    variant="text"
                    class="ma-2"
                    size="small"
                    prepend-icon="mdi-flag"
                    v-bind="activatorProps"
                >Report Skin
                </v-btn>
            </template>

            <v-card
                prepend-icon="mdi-flag"
                title="Report Skin"
            >
                <v-card-text>
                    <v-row dense>
                        <v-col>
                            <v-select
                                v-model="reason"
                                :items="reportReasons"
                                item-title="text"
                                item-value="value"
                                label="Report Reason"
                                required
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                      <InvisibleTurnstile v-if="skin" v-model:token="reportTurnstileToken" action="report-skin"/>

                    <v-btn
                        text="Cancel"
                        variant="plain"
                        @click="dialog = false"
                    ></v-btn>

                    <v-btn
                        color="warning"
                        text="Submit Report"
                        variant="tonal"
                        :disabled="!authed||!reason||reporting"
                        @click="submitReport"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import InvisibleTurnstile from "~/components/InvisibleTurnstile.vue";

const props = defineProps<{
    skin: SkinInfo2
}>();
const dialog = ref(false);

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);

const reportTurnstileToken: Ref<string> = ref('');

const reportReasons = [
    {text: "Inappropriate Skin", value: "skin"},
    {text: "Inappropriate Name", value: "name"},
    {text: "Inappropriate Tags", value: "tags"},
];
const reason = ref<string | null>(null);

const reporting = ref(false);
const submitReport = async () => {
    if (!reason.value) return;
    if (reporting.value) return;
    console.log(`Reporting skin ${ props.skin.uuid } for ${ reason.value }`);
    await $mineskin.skins.reportSkin(props.skin.uuid, reason.value, reportTurnstileToken.value);
    dialog.value = false;
}
</script>