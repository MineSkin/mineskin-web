<style>
</style>
<template>
    <v-container class="mb-4">
        Redirecting...
    </v-container>
</template>
<script setup lang="ts">

import { onBeforeRouteUpdate, useRoute } from "#app";
import { definePageMeta } from "#imports";

definePageMeta({
    middleware: [
        function (to, from) {
            const {skin} = to.params;
            if (!skin) {
                return localePath(`/skins`);
            }
            if (skin.length !== 32 && skin.length !== 36 && skin.length !== 8) {
                return false;
            }
        }
    ]
})

const localePath = useLocalePath()
const router = useRouter();
const route = useRoute();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

onMounted(() => {
    router.replace(localePath(`/skins/${ skinId.value }`));
})

</script>