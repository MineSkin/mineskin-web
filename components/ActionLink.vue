<style scoped>
a {
    text-decoration: none;
    cursor: pointer;
}
</style>
<template>
    <a class="text-primary ma-1 font-weight-bold">
        <slot name="icon">
            <v-icon v-if="icon" :icon="icon" class="mx-1"></v-icon>
        </slot>
        <slot></slot>
        <slot name="tooltip">
            <v-tooltip
                v-if="tooltip"
                activator="parent"
                location="bottom"
                >{{ tooltip }}</v-tooltip>
        </slot>
    </a>
</template>
<script setup lang="ts">
const props = defineProps<{
    icon?: string;
    tooltip?: string;
}>();
</script>