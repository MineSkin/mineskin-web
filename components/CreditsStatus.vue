<template>
    <ClientOnly>
        <div v-if="showCreditsInfo && !generating">
            <Dbg :data="{credits,creditsStatus,authed:authStore.authed}"></Dbg>
            <div v-if="credits">
                <div v-if="credits?.all?.balance>0">
                                <span>This request will consume {{
                                        imageCount || 1
                                    }} {{
                                        imageCount > 1 ? 'credits' : 'credit'
                                    }} if the {{
                                        imageCount > 1 ? 'skins are' : 'skin is'
                                    }} successfully generated.</span><br/>
                    <span>You have {{ credits?.all?.balance }} credits remaining.</span>
                </div>
                <div v-else>
                    <span>You do not have any credits remaining.</span><br/>
                    <span>This skin may take longer to generate.</span>
                </div>
                <div v-if="!authStore.authed">
                    <span>(Sign in to use credits)</span>
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

const props = defineProps<{
    imageCount: number;
    generating: boolean;
}>();

const {$mineskin,$flags} = useNuxtApp();

const authStore = useAuthStore();

const showCreditsInfo = computed(() => $flags.hasFeature('web.credits.show_info'));

const {
    data: credits,
    status: creditsStatus,
    refresh: refreshCredits
} = useLazyAsyncData<BasicCreditInfo>("credits", async () => {
    return (await $mineskin.me.credits())?.credit;
}, {
    immediate: false,
    server: false,
    dedupe: 'defer'
});

onMounted(async () => {
    await authStore.checkAuth();
    await refreshCredits();
})
</script>