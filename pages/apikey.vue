<style>
</style>
<template>
    <v-container class="mb-4">
        Redirecting...
    </v-container>
</template>
<script setup lang="ts">

useHead({
    meta: [
        {
            "http-equiv": 'refresh',
            content: '0;url=' + 'https://account.mineskin.org/keys'
        }
    ]
})

onMounted(() => {
    window.open('https://account.mineskin.org/keys', '_self');
})

</script>