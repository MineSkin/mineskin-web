<template>
    <div>
        hi
    </div>
    <component is="script" async
               :src="'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + clientId"
               crossorigin="anonymous"></component>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>