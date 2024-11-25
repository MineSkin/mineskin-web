<template>
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
<script setup lang="ts">
const props = defineProps<{
    getter: ()=>string
}>();

const justCopied = ref(false);
const tooltipText = computed(() => {
    return justCopied.value ? 'Copied!' : 'Copy to Clipboard';
});

function copyToClipboard() {
    console.log(props.getter)
    const text = props.getter();
    console.log(text)
    navigator.clipboard.writeText(text);
    justCopied.value = true;
    setTimeout(() => {
        justCopied.value = false;
    }, 2000);
}
</script>