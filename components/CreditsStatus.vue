<template>
    <ClientOnly>
        <div v-if="showCreditsInfo && !generating">
            <Dbg :data="{credits,creditsStatus,authed:authStore.authed}"></Dbg>
            <div v-if="credits">
                <div v-if="credits?.all?.balance>0">
                       <span>
                           {{
                               $t("This request will consume 1 credit if the skin is successfully generated. | This request will consume {n} credits if the skins are successfully generated.", imageCount || 1)
                           }}
                       </span>
                    <br/>
                    <span>{{
                            $t("You have {credits} remaining.", {
                                credits: $t('n_credits', credits?.all?.balance)
                            })
                        }}</span>
                </div>
                <div v-else>
                    <span>{{ $t("You do not have any credits remaining.") }}</span><br/>
                    <span>{{ $t("This skin may take longer to generate.") }}</span>
                </div>
                <div v-if="!authStore.authed">
                    <span>{{ $t("(Sign in to use credits)") }}</span>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLazyAsyncData } from "nuxt/app";
import type { BasicCreditInfo } from "~/types/BasicCreditInfo";
import { computed } from "vue";
import { useNuxtData } from "#imports";

const props = defineProps<{
    imageCount: number;
    generating: boolean;
}>();

const {$mineskin, $flags} = useNuxtApp();

const authStore = useAuthStore();

const showCreditsInfo = computed(() => $flags.hasFeature('web.credits.show_info'));

const {
    data: credits,
    status: creditsStatus,
    refresh: refreshCredits
} = useLazyAsyncData<BasicCreditInfo>("credits-status", async () => {
    return (await $mineskin.me.credits())?.credit;
}, {
    immediate: false,
    server: false
});

onMounted(async () => {
    await authStore.checkAuth();
    await refreshCredits();
})
</script>