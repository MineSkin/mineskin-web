<style scoped>
.ad-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.ad-fallback {
    position: absolute;
    z-index: 0;
}
</style>
<template>
    <ClientOnly>
        <div class="ad-wrapper" v-if="ready && grants && !grants.ad_free">
            <slot name="ad">
                <!-- {{ adSlot }} -->
                <div :id='adId'>
                    <component is="script">
                        {{ isDev ? 'google_adtest = "on";' : '' }}
                        "{{ ready }} {{ grants.ad_free }}";
                        googletag.cmd.push(function() {
                        googletag.defineSlot('{{ adSlot }}', ['fluid'], '{{ adId }}').addService(googletag.pubads());
                        googletag.pubads().enableSingleRequest();
                        googletag.enableServices();
                        googletag.cmd.push(function() { googletag.display('{{ adId }}'); });
                        });
                    </component>
                </div>
            </slot>
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
    adId?: string;
    adFormat?: string;
    adLayoutKey?: string;
    responsive?: boolean;
    noFallback?: boolean
}>();

const authStore = useAuthStore();
const {grants} = storeToRefs(authStore);

const ready = ref(false);
onMounted(() => {
    if (grants.value && !grants.value.ad_free) {
        const adScript = document.createElement('script');

        adScript.type = 'text/javascript';
        adScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        adScript.async = true;
        adScript.crossOrigin = 'anonymous';
        document.head.appendChild(adScript);

        const w = window as any;
        if (w.googletag) w.googletag.pubads().refresh();
        w.googletag = w.googletag || {cmd: []};
    }

    ready.value = true;
});
</script>