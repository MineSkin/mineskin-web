<template>
    <AdWrappper>
        <template v-slot:ad>
            <ins class="adsbygoogle"
                 style="display:block"
                 :data-adtest="isDev ? 'on': ''"
                 :data-ad-client="clientId"
                 :data-ad-slot="adSlot"
                 data-ad-format="autorelaxed"
                 data-matched-content-ui-type="image_stacked"
                 :data-matched-content-rows-num="1"
                 :data-matched-content-columns-num="1"></ins>
        </template>
    </AdWrappper>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
}>();
</script>