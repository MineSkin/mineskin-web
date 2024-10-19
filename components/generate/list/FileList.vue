<template>
    <div>
        <v-row justify="center" align="center" class="my-2"
               v-for="(item, index) in items"
               :key="index"
        >
            <v-col>
            <file-list-row
                :model-value="item.name"
                :item="item"
                :label="label"
                readonly
                type="text"
                append-icon="mdi-minus"
                :prepend-icon="prependIcon"
                :image-provider="imageProvider"
                @click:append="items.splice(index,1)">
            </file-list-row>
            </v-col>
        </v-row>
    </div>
</template>
<script setup lang="ts">
import '~/assets/css/img.css'
import FileListRow from "./FileListRow.vue";
const items = defineModel<File[]>([]);
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
    imageProvider?: (file: File)=>string;
}>()
</script>