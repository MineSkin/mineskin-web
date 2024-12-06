<style>
</style>
<template>
    <v-container class="mb-4">
        Redirecting...
    </v-container>
</template>
<script setup lang="ts">

onMounted(() => {
    window.open('https://account.mineskin.org', '_self');
})

</script>