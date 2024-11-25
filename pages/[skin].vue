<style>
</style>
<template>
    <v-container class="mb-4">
        Moved!
    </v-container>
</template>
<script setup lang="ts">

const router = useRouter();

const skinId = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    return currentRoute.params['skin'] as string;
});

onMounted(() => {
    router.push(`/skins/${ skinId.value }`);
})

</script>