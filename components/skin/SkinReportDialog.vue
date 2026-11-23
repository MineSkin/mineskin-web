<template>
    <div>
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
                >{{ $t("Report Skin") }}
                </v-btn>
            </template>

            <v-card
                prepend-icon="mdi-flag"
                :title="$t('Report Skin')"
            >
                <v-card-text>
                    <v-row dense>
                        <v-col>
                            <v-select
                                v-model="reason"
                                :items="reportReasons"
                                item-title="text"
                                item-value="value"
                                :label="$t('Report Reason')"
                                required
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                      <InvisibleTurnstile v-if="skin && reportTurnstile" v-model:token="reportTurnstileToken" action="report-skin"/>

                    <v-btn
                        :text="$t('Cancel')"
                        variant="plain"
                        @click="dialog = false"
                    ></v-btn>

                    <v-btn
                        color="warning"
                        :text="$t('Submit Report')"
                        variant="tonal"
                        :disabled="!authed||!reason||reporting"
                        :loading="reporting"
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
import { until, useCounter } from "@vueuse/core";

const props = defineProps<{
    skin: SkinInfo2
}>();
const dialog = ref(false);

const {$mineskin, $notify} = useNuxtApp();
const {t: $t} = useI18n();

const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);

const reportTurnstile = ref(true);
const reportTurnstileToken: Ref<string|null> = ref(null);

const reportReasons = computed(() => [
    {text: $t("Inappropriate Skin"), value: "skin"},
    {text: $t("Inappropriate Name"), value: "name"},
    {text: $t("Inappropriate Tags"), value: "tags"},
]);
const reason = ref<string | null>(null);

const reporting = ref(false);
const submitReport = async () => {
    if (!reason.value) return;
    if (reporting.value) return;
    reporting.value = true;
    try {
        console.log(`Reporting skin ${ props.skin.uuid } for ${ reason.value }`);
        const token = await until(reportTurnstileToken).not.toBeNull({timeout: 5000});
        reportTurnstile.value = false;
        const res = await $mineskin.skins.reportSkin(props.skin.uuid, reason.value, token);
        // the API client already shows the server's confirmation / error message;
        // only close when the report actually went through, so a rejected one can be retried
        if (res?.success === false) return;
        dialog.value = false;
        reason.value = null;
    } catch (e) {
        console.error(e);
        $notify({
            text: $t('Failed to submit report. Please try again.'),
            color: 'error'
        });
    } finally {
        reportTurnstileToken.value = null;
        reportTurnstile.value = true;
        reporting.value = false;
    }
}
</script>