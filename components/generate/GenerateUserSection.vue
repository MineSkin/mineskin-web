<template>
    <v-col
        class="mx-4"
    >
        <v-row justify="center" class="mb-2">
            USER
        </v-row>
        <InputList
            v-model="users"
            label="USER"
            type="text"
            rule="user"
            prepend-icon="mdi-account"
        />
        <v-row justify="center" align="center">
            <v-btn
                color="primary"
                icon="mdi-arrow-right"
                variant="elevated"
                aria-label="Continue"
            ></v-btn>
        </v-row>
        <dbg :data="users"/>
    </v-col>
</template>
<script setup lang="ts">
const users = defineModel<string[]>([''])
</script>