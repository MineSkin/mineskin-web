<template>
    <div>
        <v-row justify="center" align="center" class="my-2"
               v-for="(item, index) in items"
               :key="index"
        >
            <v-text-field
                :model-value="item.name"
                :label="label"
                readonly
                type="text"
                :prepend-icon="prependIcon"
                append-icon="mdi-minus"
                @click:append="items.splice(index,1)"
            />
        </v-row>
    </div>
</template>
<script setup lang="ts">
const items = defineModel<File[]>([]);
const props = defineProps<{
    label?: string;
    prependIcon?: string;
    type?: string;
    rule?: string;
}>()
</script>