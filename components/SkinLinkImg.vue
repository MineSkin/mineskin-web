<template>
    <router-link :to="skin?('/'+skin.uuid):undefined">
        <v-sheet
            width="min(180px,max(90px,20vmin))"
        >
            <v-img
                lazy-src="/img/questionhead.png"
                :src="renderSkinHead(skin?.texture)"
                aspect-ratio="1"
            />
        </v-sheet>
    </router-link>
</template>
<script setup lang="ts">
import { renderSkinHead } from "~/util/render";
import type { ListedSkin } from "~/types/SkinListResponse";

const router = useRouter();

const props = defineProps<{
    skin: ListedSkin
}>();

function viewSkin(uuid: string) {
    router.push(`/${ uuid }`);
}

</script>
