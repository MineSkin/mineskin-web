<template>
    <v-img
        :lazy-src="PLACEHOLDER_HEAD"
        :src="renderSkinHead(texture||skin?.texture)"
        aspect-ratio="1"
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
</script>