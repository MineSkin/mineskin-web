<template>
    <v-text-field
        type="text"
        append-icon="mdi-minus"
        hide-details
    >
        <template v-slot:prepend>
            <div>
                <v-img v-if="imageProvider && image" class="pixelated input-prepend-image" :src="image"
                       aspect-ratio="1"/>
                <v-icon v-else :icon="prependIcon"/>
            </div>
        </template>
    </v-text-field>
</template>
<script setup lang="ts">
import '~/assets/css/img.css'
import type { FileJson } from "~/util/file";

const props = defineProps<{
    item: FileJson,
    imageProvider?: (file: FileJson) => string;
    prependIcon?: string;
}>();

const image = computed(() => {
    if (!props.item || !props.imageProvider) return undefined;
    return props.imageProvider(props.item);
});
</script>