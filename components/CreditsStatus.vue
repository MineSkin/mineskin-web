<template>
    <ClientOnly>
        <div v-if="showCreditsInfo && !generating">
             <span>{{
                     $t("This request will consume {credits} if the {skins} successfully generated.", {
                         credits: $t('n_credits', imageCount || 1),
                         skins: $t('skin_is_are', imageCount || 1)
                     })
                 }}</span>
            <span>{{
                    $t("You have {credits} remaining.", {
                        credits: $t('n_credits', credits?.all?.balance)
                    })
                }}</span>
            <Dbg :data="{credits,creditsStatus,authed:authStore.authed}"></Dbg>
            <div v-if="credits">
                <div v-if="credits?.all?.balance>0">
                    <span>You have {{ credits?.all?.balance }} credits remaining.</span>
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