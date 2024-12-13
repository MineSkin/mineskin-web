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

useHead({
    meta: [
        {
            "http-equiv": 'refresh',
            content: '0;url=' + localePath(`/skins`)
        }
    ]
})

onMounted(() => {
    router.replace(localePath(`/skins`));
})

</script>