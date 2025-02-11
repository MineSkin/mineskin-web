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
                <inline-job-progress :original-name="item.name" :waiting="waiting"/>
            </v-col>
        </v-row>
    </div>
</template>
<script setup lang="ts">
import '~/assets/css/img.css'
import FileListRow from "./FileListRow.vue";
import InlineJobProgress from "~/components/generate/InlineJobProgress.vue";
import type { FileJson } from "~/util/file";

const items = defineModel<FileJson[]>([]);
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
    imageProvider?: (file: FileJson) => string;
    waiting?: boolean;
}>()
</script>