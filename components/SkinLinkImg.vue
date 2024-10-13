<template>
    <v-sheet width="180" height="180" class="v-icon--clickable pa-2">
        <v-img
            lazy-src="/img/questionhead.png"
            :src="renderSkinHead(skin.texture)"
            aspect-ratio="1"
        />
    </v-sheet>
</template>
<script setup lang="ts">
import { renderSkinHead } from "~/util/render";
import type { ListedSkin } from "~/types/SkinListResponse";
const props = defineProps<{
    skin: ListedSkin
}>();
</script>