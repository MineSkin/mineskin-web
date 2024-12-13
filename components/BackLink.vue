<template>
    <NuxtLink prefetch prefetch-on="interaction" :to="localePath(computedPath)" @click="handleClick">
        <slot></slot>
    </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
    to: string;
}>();

const localePath = useLocalePath();
const router = useRouter();
const lastPath = computed<string>(() => router.options.history.state.back ?? "");

const computedPath = computed<string>(() => {
    return lastPath.value || props.to;
});

const handleClick = () => {
    if (lastPath.value) {
        router.back();
    }
};
</script>