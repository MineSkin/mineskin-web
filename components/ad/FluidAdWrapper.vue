<template>
    <AdWrappper>
        <template v-slot:ad>
            <ins class="adsbygoogle"
                 style="display:block"
                 :data-adtest="isDev ? 'on': ''"
                 :data-ad-client="clientId"
                 :data-ad-slot="adSlot"
                 data-ad-format="fluid"
                 :data-ad-layout-key="adLayoutKey"
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
}>();
</script>