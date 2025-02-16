<style scoped>
.cape-canvas {
    image-rendering: pixelated;
    min-width: 20px;
}
</style>
<template>
    <canvas ref="cape-canvas" class="cape-canvas"></canvas>
</template>
<script setup lang="ts">
const props = defineProps<{
    texture: string;
}>()
const capeCanvas = useTemplateRef("cape-canvas");

onMounted(() => {
    const canvas = capeCanvas.value as HTMLCanvasElement;
    if (!canvas) {
        return;
    }
    canvas.width = 10;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 1, 1, 10, 16, 0, 0, 10, 16);
    }
    img.src = props.texture;
})

</script>