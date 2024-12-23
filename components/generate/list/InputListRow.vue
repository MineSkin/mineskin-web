<template>
    <v-text-field hide-details>
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
import { computedAsync } from "@vueuse/core";

const props = defineProps<{
    item: string;
    imageProvider?: (item: string) => string | Promise<string>;
    prependIcon?: string;
}>();

const image = computedAsync(async () => {
    if (!props.item || !props.imageProvider) return undefined;
    return await props.imageProvider(props.item);
});
</script>