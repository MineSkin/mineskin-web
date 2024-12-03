<style>
</style>
<template>
    <v-container class="mb-4">
        Redirecting...
    </v-container>
</template>
<script setup lang="ts">

const localePath = useLocalePath()
const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

onMounted(() => {
    router.push(localePath(`/skins/${ skinId.value }`));
})

</script>