<template>
    <v-text-field :model-value="value">
        <template v-slot:[location]>
            <v-tooltip location="bottom" :text="tooltipText">
                <template v-slot:activator="{ props }">
                    <v-icon
                        v-bind="props"
                        role="button"
                        tabindex="0"
                        :aria-label="tooltipText"
                        @click="copyToClipboard"
                        @keydown.enter="copyToClipboard"
                        @keydown.space.prevent="copyToClipboard"
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

const {$gtag, $notify} = useNuxtApp();

const justCopied = ref(false);
const tooltipText = computed(() => {
    return justCopied.value ? 'Copied!' : 'Copy to Clipboard';
});

function copyToClipboard() {
    if (!props.value) return;
    navigator.clipboard.writeText(props.value).then(() => {
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
    }).catch((e) => {
        console.error('failed to copy to clipboard', e);
        $notify({
            text: 'Failed to copy to clipboard',
            color: 'error'
        });
    });
}
</script>