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
            <!--            <div class="ad-fallback text-red pa-6 text-center w-100" v-show="!noFallback">-->
            <!--                Please disable your ad blocker-->
            <!--            </div>-->
            <component is="script" async
                       src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" crossorigin="anonymous"/>
            <component is="script">
                {{ isDev ? 'google_adtest = "on";' : '' }}
                window.googletag = window.googletag || {cmd: []};
                "{{ ready }} {{ grants.ad_free }}";
                googletag.cmd.push(function() {
                googletag.defineSlot('{{ adSlot }}', ['fluid'], '{{ adId }}').addService(googletag.pubads());
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
                });
            </component>
            <slot name="ad">
                <!-- {{ adSlot }} -->
                <div :id='adId'>
                    <component is="script">
                        googletag.cmd.push(function() { googletag.display('{{ adId }}'); });
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
    ready.value = true;
});
</script>