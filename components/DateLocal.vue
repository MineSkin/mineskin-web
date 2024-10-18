<template>
    <span>{{ new Date(date).toLocaleString() }}</span>
</template>
<script setup lang="ts">
const props = defineProps<{
    date: string|number|Date
}>();
</script>