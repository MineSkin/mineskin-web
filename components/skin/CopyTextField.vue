<template>
    <v-text-field :model-value="value">
        <template v-slot:[location]>
            <v-tooltip location="bottom" :text="tooltipText">
                <template v-slot:activator="{ props }">
                    <v-icon
                        v-bind="props"
                        @click="copyToClipboard"
                    >mdi-content-copy
                    </v-icon>
                </template>
            </v-tooltip>
        </template>
    </v-text-field>
</template>
<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";

const props = defineProps<{
    value: string,
    contentKey?: string,
    location: 'append' | 'prepend'
}>();

const {$gtag} = useNuxtApp();

const justCopied = ref(false);
const tooltipText = computed(() => {
    return justCopied.value ? 'Copied!' : 'Copy to Clipboard';
});

function copyToClipboard() {
    navigator.clipboard.writeText(props.value);
    justCopied.value = true;
    setTimeout(() => {
        justCopied.value = false;
    }, 2000);
    try {
        if (props.contentKey) {
            $gtag('event', 'copy_text', {
                content_key: props.contentKey,
                element: 'textfield'
            })
        }
    } catch (e) {
        console.error(e);
    }
}
</script>