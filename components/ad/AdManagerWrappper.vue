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
                <div :id='adId' v-if="gtag">
                    <component is="script">
                        {{ isDev ? 'google_adtest = "on";' : '' }}
                        "{{ ready }} {{ grants.ad_free }}";
                        googletag.cmd.push(function() {
                            console.debug('Defining ad slot {{ adSlot }} with id {{ adId }}');
                            try{googletag.defineSlot('{{ adSlot }}', ['fluid'], '{{ adId }}').addService(googletag.pubads());}catch(e){console.error('Error defining ad slot:', e);}
                            googletag.pubads().enableSingleRequest();
                            googletag.enableServices();

                            console.debug('Displaying ad slot {{ adSlot }} with id {{ adId }}');
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
const gtag = ref(null);
onMounted(() => {
    ready.value = true;
});

watch(() => grants.value, newGrants => {
    if (newGrants && !newGrants.ad_free) {
        const w = window as any;
        if (w.googletag) {
            console.debug('googletag already exists, refreshing ads');
            w.googletag.pubads().refresh();
            gtag.value = w.googletag;
            return;
        }

        console.debug('Loading googletag script');
        const adScript = document.createElement('script');

        adScript.type = 'text/javascript';
        adScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        adScript.async = true;
        adScript.crossOrigin = 'anonymous';
        document.head.appendChild(adScript);

        console.debug('Initializing googletag');
        w.googletag = w.googletag || {cmd: []};
        gtag.value = w.googletag;
    }
},{immediate: true})

onBeforeUnmount(() => {
    const googletag = (window as any).googletag;
    if (googletag) {
        console.debug('Destroying googletag slots');
        googletag.destroySlots();
    }

})
</script>