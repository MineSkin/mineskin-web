<style scoped>
.skin-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
<template>
    <nuxt-link :to="skin ? ('/skins/'+skin.uuid) : undefined">
        <v-sheet
            class="pa-2"
        >
            <SkinHeadImg :skin="skin"/>
            <v-divider v-if="!noTitle" class="my-2"/>
            <div class="skin-name" v-if="!noTitle">{{ skin?.name || skin?.uuid?.substring(0, 8) }}</div>
        </v-sheet>
    </nuxt-link>
</template>
<script setup lang="ts">
import SkinHeadImg from "../SkinHeadImg.vue";
import type { ListedSkin } from "../../types/SkinListResponse";

const props = defineProps<{
    skin?: ListedSkin,
    noTitle?: boolean
}>();
</script>