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
                :append-icon="canAdd(index) ? 'mdi-plus' : canRemove(index)? 'mdi-minus':''"
                :prepend-icon="prependIcon"
                :image-provider="imageProvider"
                @click:append="listAddOrRemove(index)"
            >
            </input-list-row>
            <dbg :data="{rule,rules,item:items[index]}"/>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { computedAsync, useDebounceFn } from '@vueuse/core'
import InputListRow from "./InputListRow.vue";

const items = defineModel<string[]>(['']);
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
    imageProvider?: (item: string) => string | Promise<string>;
}>();

const {$mineskin} = useNuxtApp();

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

function listAddOrRemove(index: number) {
    if (canAdd(index)) {
        items.value.push('');
    } else if (canRemove(index)) {
        items.value.splice(index, 1);
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