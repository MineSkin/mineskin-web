<style scoped>
.loading-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
</style>
<template>
    <div class="loading-indicator" v-show="show">
        <v-progress-linear indeterminate></v-progress-linear>
    </div>
</template>

<script setup lang="ts">
    const nuxtApp = useNuxtApp();
    const show = ref(false);

    addRouteMiddleware('global-loader', () => show.value = true, { global: true })
    nuxtApp.hook('page:finish', () => {
        show.value = false
    })
</script>