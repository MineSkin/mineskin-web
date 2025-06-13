<template>
    <v-row justify="center" align="center" class="my-2"
           v-for="(item, index) in items"
           :key="index"
    >
        <v-col>
            <input-list-row
                :model-value="items[index]"
                @update:modelValue="change(index, $event)"
                :item="items[index]"
                :type="type"
                :label="label"
                :rules="rules"
                :append-icon="isJobDone(index) ? 'mdi-open-in-new': canAdd(index) ? 'mdi-plus' :''"
                :append-inner-icon="canRemove(index)? 'mdi-minus':canClear(index) ? 'mdi-close-circle' : ''"
                :prepend-icon="prependIcon"
                :image-provider="imageProvider"
                @click:append="listClick(index)"
                @click:append-inner="listClick(index, true)"
            >
            </input-list-row>
            <inline-job-progress :original-name="items[index]" :waiting="waiting"/>
            <dbg :data="{rule,rules,item:items[index]}"/>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { computedAsync, useDebounceFn } from '@vueuse/core'
import InputListRow from "./InputListRow.vue";
import InlineJobProgress from "~/components/generate/InlineJobProgress.vue";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";
import type { WrappedJob } from "~/types/WrappedJob";

const items = defineModel<string[]>({required: true});
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
    imageProvider?: (item: string) => string | Promise<string>;
    waiting?: boolean;
}>();

const {$mineskin} = useNuxtApp();

const router = useRouter();
const localePath = useLocalePath();
const queueStore = useQueueStore();
const {wrappedJobMap} = storeToRefs(queueStore);

const allRules = {
    required: (value: string) => !!value || 'Required.',
    url: (value: string) => !value || value.startsWith('http') || 'Invalid URL',
    uuidOrName: (value: string) => !value || (value.length > 1 && (value.length < 17 || value.length >= 32) && /^[a-z0-9_]+$/i.test(value)) || 'Invalid UUID or Name',
    validNameOrUuid: (value: string) => {
        validateUser(value);
        return true;
    }
};

const rules = computed(() => {
    switch (props.rule) {
        case 'url':
            return [allRules.url];
        case 'user':
            return [allRules.uuidOrName, allRules.validNameOrUuid];
        default:
            return [];
    }
})

function change(index: number, value: string) {
    items.value[index] = value;
}

function canAdd(index: number) {
    return index === items.value.length - 1 && items.value[index] !== '';
}

function canRemove(index: number) {
    return (index !== 0 || items.value.length > 1) && items.value.length > 1;
}

function canClear(index: number) {
    return index===0&& items.value[index] !== '';
}

function getJob(index: number): WrappedJob | undefined {
    return Object.values(wrappedJobMap.value).find(job => job.source.name === items.value[index] || job.source.name === items.value[index].name)
}

function isJobDone(index: number): boolean {
    return getJob(index)?.job?.status === 'completed';
}

function listClick(index: number, inner: boolean = false) {
    if (!inner) {
        const job = getJob(index);
        if (job?.job?.status === 'completed') {
            if (job?.job?.result) {
                router.push(localePath(`/skins/${ job?.job?.result }`));
            }
            return;
        }
    }

    if (!inner && canAdd(index)) {
        items.value.push('');
    } else if (canRemove(index)) {
        items.value.splice(index, 1);
    }else if (inner && index === 0) {
        items.value[0] = '';
    }
}

const validateUser = useDebounceFn(validateUser0, 500);

async function validateUser0(user: string) {
    if (user.length < 32) {
        return await $mineskin.validate.name(user);
    } else {
        return await $mineskin.validate.uuid(user);
    }
}

</script>