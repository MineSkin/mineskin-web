<style scoped>
.preview {
    image-rendering: pixelated;
}
</style>
<template>
    <div>
        <v-img class="preview" aspect-ratio="1" :src="texture"></v-img>
        <!--        <v-img class="preview" aspect-ratio="1" :src="image"></v-img>-->
    </div>
</template>
<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { fileAsBase64, renderSkinHead, textureUrlForUuid } from "../../util/render";
import { computed } from "vue";

const props = defineProps<{
    url?: string;
    user?: string;
    file?: File;
}>();

const {$mineskin} = useNuxtApp();

const userValidation = computedAsync(async () => {
    if (props.user) {
        if (props.user.length < 32) {
            return await $mineskin.validate.name(props.user);
        }else {
            return await $mineskin.validate.uuid(props.user);
        }
    }
    return undefined;
});

const fileBase64 = computedAsync(async () => {
    if (props.file) {
        return await fileAsBase64(props.file);
    }
    return undefined;
})

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
        return fileBase64.value;
    }
});

const image = computed(() => {
    if (props.file) {
        return fileBase64.value;
    }
    return renderSkinHead(texture.value);
})
</script>