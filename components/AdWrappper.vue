<style scoped>
.ad-wrapper {
    width: 100%;
    height: 100%;
}
</style>
<template>
    <ClientOnly>
        <div class="ad-wrapper" v-if="ready && !adFree">
            <component is="script" async
                       :src="'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + clientId"
                       crossorigin="anonymous"></component>
            <slot name="ad">
                <ins class="adsbygoogle"
                     style="display:block"
                     :data-adtest="isDev ? 'on': ''"
                     :data-ad-client="clientId"
                     :data-ad-slot="adSlot"
                     :data-ad-format="adFormat||'auto'"
                     :data-ad-layout-key="adLayoutKey"
                     :data-full-width-responsive="responsive||true"></ins>
            </slot>
            <component is="script">
                {{ isDev ? 'google_adtest = "on";' : '' }}
                (adsbygoogle = window.adsbygoogle || []).push({});
            </component>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
    adFormat?: string;
    adLayoutKey?: string;
    responsive?: boolean;
}>();

const authStore = useAuthStore();
const {grants} = storeToRefs(authStore);

const adFree = computed(() => (grants as any)?.ad_free);

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>