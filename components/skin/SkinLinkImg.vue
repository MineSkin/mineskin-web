<template>
    <nuxt-link prefetch prefetch-on="interaction" :to="skin?localePath('/skins/'+skin.uuid):undefined">
        <v-sheet
            width="min(180px,max(90px,20vmin))"
        >
            <SkinHeadImg :skin="skin"/>
        </v-sheet>
    </nuxt-link>
</template>
<script setup lang="ts">

import { useRouter } from "nuxt/app";
import type { ListedSkin } from "../../types/SkinListResponse";
import SkinHeadImg from "../SkinHeadImg.vue";

const localePath = useLocalePath()
const router = useRouter();

const props = defineProps<{
    skin: ListedSkin
}>();

function viewSkin(uuid: string) {
    router.push(localePath(`/skins/${ uuid }`));
}

</script>
