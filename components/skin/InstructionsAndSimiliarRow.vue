<template>
    <v-row>
        <v-col cols="12" :md="hasSimilar?6:12">
            <SkinInstructionsCard :skin="skin"/>
        </v-col>
        <v-col cols="12" md="6" v-if="showSimilar" v-show="hasSimilar">
            <SimilarSkinsCard :skin="skin" v-model="hasSimilar"/>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import type { SkinInfo2 } from "@mineskin/types";
import SimilarSkinsCard from "~/components/skin/SimilarSkinsCard.vue";
import SkinInstructionsCard from "~/components/skin/SkinInstructionsCard.vue";
import { computed } from "vue";
import { useNuxtApp } from "nuxt/app";

const {$flags} = useNuxtApp();

const props = defineProps<{
    skin: SkinInfo2;
}>();

const hasSimilar = ref<boolean>(false);

const showSimilar = computed(() => $flags.hasFeature('web.show_similar'));
</script>