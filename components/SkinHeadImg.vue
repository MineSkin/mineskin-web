<style>
.skin-head-img {
    --skin-head-sat: 100%;
    --skin-head-hue: 0deg;
}

.skin-head-img .v-img__img.v-img__img--preload {
    filter: sepia(1) hue-rotate(var(--skin-head-hue, 0deg)) saturate(var(--skin-head-sat, 100%)) blur(4px);
}
</style>
<template>
    <v-img
        class="skin-head-img"
        :lazy-src="PLACEHOLDER_HEAD"
        :src="renderSkinHead(texture||skin?.texture)"
        aspect-ratio="1"
        :style="{'--skin-head-hue': color + 'deg', '--skin-head-sat': sat + '%'}"
    />
</template>
<script setup lang="ts">
import { PLACEHOLDER_HEAD } from "~/util/skin";
import { renderSkinHead } from "~/util/render";
import type { ListedSkin } from "~/types/SkinListResponse";

const props = defineProps<{
    skin?: ListedSkin
    texture?: string
}>();

const sat = ref<number>(Math.floor(Math.random() * 20) * 10 + 100);
const color = ref<number>(Math.floor(Math.random() * 360));
</script>