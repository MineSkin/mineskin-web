<template>
    <AdWrappper>
        <template v-slot:ad>
            <ins class="adsbygoogle"
                 style="display:block"
                 :data-adtest="isDev ? 'on': undefined"
                 :data-ad-client="clientId"
                 :data-ad-slot="adSlot"
                 data-ad-format="autorelaxed"
                 :data-matched-content-ui-type="uiType"
                 :data-matched-content-rows-num="rows"
                 :data-matched-content-columns-num="cols"></ins>
        </template>
    </AdWrappper>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
    uiType?: string;
    rows?: number;
    cols?: number;
}>();
</script>