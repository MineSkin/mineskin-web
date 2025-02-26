<template>
    <AdWrappper>
        <template v-slot:ad>
            <ins class="adsbygoogle"
                 style="display:block"
                 :style="{width: width ? width + 'px' : 'auto', height: height ? height + 'px' : 'auto'}"
                 :data-adtest="isDev ? 'on': undefined"
                 :data-ad-client="clientId"
                 :data-ad-slot="adSlot"
                 :data-full-width-responsive="responsive||true"></ins>
        </template>
    </AdWrappper>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
    adLayoutKey?: string;
    responsive?: boolean;
    width?: number;
    height?: number;
}>();
</script>