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

onMounted(() => {
    router.push(localePath(`/skins`));
})

</script>