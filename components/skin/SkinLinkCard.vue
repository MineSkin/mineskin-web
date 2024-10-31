<template>
    <nuxt-link :to="skin?('/'+skin.uuid):undefined">
        <v-sheet
            class="pa-2"
        >
            <SkinHeadImg :skin="skin"/>
            <v-divider v-if="!noTitle" class="my-2"/>
            <span v-if="!noTitle">{{ skin?.name || skin?.uuid?.substring(0, 8) }}</span>
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