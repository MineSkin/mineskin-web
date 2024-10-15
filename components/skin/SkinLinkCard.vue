<template>
    <nuxt-link :to="'/'+skin.uuid">
        <v-sheet
            width="min(180px,max(90px,20vmin))"
            class="pa-2">
            <SkinHeadImg :skin="skin"/>
            <v-divider class="my-2"/>
            {{ skin.name || skin.uuid?.substring(0, 8) }}
        </v-sheet>
    </nuxt-link>
</template>
<script setup lang="ts">
import SkinHeadImg from "../SkinHeadImg.vue";
import type { ListedSkin } from "../../types/SkinListResponse";

const props = defineProps<{
    skin: ListedSkin
}>();
</script>