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
                    :append-icon="isJobDone(index)?'mdi-open-in-new':''"
                    append-inner-icon="mdi-minus"
                    :prepend-icon="prependIcon"
                    :image-provider="imageProvider"
                    @click:append="listClick(index)"
                    @click:append-inner="listClick(index,false)"
                >
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
import type { WrappedJob } from "~/types/WrappedJob";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";

const items = defineModel<FileJson[]>({required: true});
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
    imageProvider?: (file: FileJson) => string;
    waiting?: boolean;
}>();

const router = useRouter();
const localePath = useLocalePath();
const queueStore = useQueueStore();
const {wrappedJobMap} = storeToRefs(queueStore);

function getJob(index: number): WrappedJob | undefined {
    return Object.values(wrappedJobMap.value).find(job => job.source.name === items.value[index].name)
}

function isJobDone(index: number): boolean {
    return getJob(index)?.job?.status === 'completed';
}

function listClick(index: number, open: boolean = true) {
    if(open) {
        const job = getJob(index);
        if (job?.job?.status === 'completed') {
            if (job?.job?.result) {
                router.push(localePath(`/skins/${ job?.job?.result }`));
            }
            return;
        }
    }
    items.value.splice(index, 1);
}
</script>