<template>
    <div>
        <v-row justify="center" align="center" class="my-2"
               v-for="(item, index) in items"
               :key="index"
        >
            <v-text-field
                :model-value="items[index]"
                @update:modelValue="change(index, $event)"
                :type="type"
                :label="label"
                :rules="rules"
                :prepend-icon="prependIcon"
                :append-icon="canAdd(index) ? 'mdi-plus' : canRemove(index)? 'mdi-minus':''"
                @click:append="listAddOrRemove(index)"
            />
        </v-row>
    </div>
</template>
<script setup lang="ts">
const items = defineModel<string[]>(['']);
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
}>()

const allRules = {
    required: (value: string) => !!value || 'Required.',
    url: (value: string) => !value || value?.startsWith('http') || 'Invalid URL',
    uuidOrName: (value: string) => !value || value?.length > 1 && (value.length < 17 || value.length > 32) || 'Invalid UUID or Name'
};

const rules = computed(() => {
    switch (props.rule) {
        case 'url':
            return [allRules.url];
        case 'user':
            return [allRules.uuidOrName];
        default:
            return [];
    }
})

function change(index: number, value: string) {
    console.log(index, value);
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
</script>