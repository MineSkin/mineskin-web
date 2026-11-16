<template>
    <div class="text-center my-6" role="alert">
        <v-icon icon="mdi-alert-circle-outline" size="40" color="error"/>
        <div class="mt-2">{{ $t("Failed to load skins. Please try again.") }}</div>
        <v-btn
            class="mt-4"
            color="primary"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="emit('retry')"
        >
            {{ $t("Try again") }}
        </v-btn>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    loading?: boolean;
}>();

const emit = defineEmits<{
    retry: [];
}>();
</script>
