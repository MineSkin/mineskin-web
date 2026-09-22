<template>
    <v-tooltip :location="tooltipLocation||'bottom'" :text="tooltipText" open-on-click>
        <template v-slot:activator="{ props }">
            <v-icon
                v-bind="props"
                @click="copyToClipboard"
                @keydown.enter="copyToClipboard"
                @keydown.space.prevent="copyToClipboard"
                :disabled="!text"
                :size="size"
                role="button"
                :tabindex="text ? 0 : undefined"
                :aria-label="tooltipText"
            >
                mdi-content-copy
            </v-icon>
        </template>
    </v-tooltip>
</template>
<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";

const props = defineProps<{
    text?: string,
    contentKey?: string,
    size?: string,
    tooltipLocation?: string
}>();

const {$gtag, $notify} = useNuxtApp();

const justCopied = ref(false);
const tooltipText = computed(() => {
    return justCopied.value ? $t('Copied!') : $t('Copy to Clipboard');
});

async function copyToClipboard() {
    if (!props.text) return;
    try {
        await navigator.clipboard.writeText(props.text);
    } catch (e) {
        console.error('copy to clipboard failed', e);
        $notify({
            text: $t('Failed to copy to clipboard'),
            color: 'error'
        });
        return;
    }
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