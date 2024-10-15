<style scoped>
.preview {
    image-rendering: pixelated;
}
</style>
<template>
    <v-img class="preview" aspect-ratio="1" :src="texture"></v-img>
</template>
<script setup lang="ts">
import { renderSkinBody, renderSkinHead, textureUrlForUuid } from "~/util/render";
import { computedAsync } from "@vueuse/core";

const props = defineProps<{
    url?: string;
    user?: string;
    file?: File;
}>();

const {$mineskin} = useNuxtApp();

const userValidation = computedAsync(async () => {
    if (props.user) {
        return await $mineskin.validate.name(props.user);
    }
    return undefined;
});

const texture = computed(() => {
    if (props.user) {
        const validated = userValidation.value;
        if (!validated) return undefined;
        return textureUrlForUuid(validated.uuid!);
    }
    if (props.url) {
        return props.url;
    }
    if (props.file) {
        return URL.createObjectURL(props.file);
    }
});

const image = computed(()=>{
    return renderSkinHead(texture.value);
})
</script>