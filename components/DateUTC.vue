<template>
    <span>{{ new Date(date).toUTCString() }}</span>
</template>
<script setup lang="ts">
const props = defineProps<{
    date: string|number|Date
}>();
</script>