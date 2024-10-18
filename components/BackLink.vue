<template>
    <NuxtLink v-if="lastPath" :to="lastPath" @click="$router.back()">
        <slot></slot>
    </NuxtLink>
    <NuxtLink v-else :to="to">
        <slot></slot>
    </NuxtLink>
</template>
<script setup lang="ts">

const props = defineProps<{
    to: string;
}>();

const router = useRouter();
const lastPath = computed<string>(() => router.options.history.state.back ?? "");
</script>