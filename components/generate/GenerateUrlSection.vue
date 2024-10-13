<template>
    <v-col
        class="mx-4"
    >
        <v-row justify="center" class="mb-2">
            URL
        </v-row>
        <InputList
            v-model="urls"
            label="URL"
            type="url"
            rule="url"
            prepend-icon="mdi-link"
        />
        <v-row justify="center" align="center">
            <v-btn
                color="primary"
                icon="mdi-arrow-right"
                variant="elevated"
                aria-label="Continue"
            ></v-btn>
        </v-row>
        <dbg :data="urls"/>
    </v-col>
</template>
<script setup lang="ts">
const urls = defineModel<string[]>(['']);
</script>