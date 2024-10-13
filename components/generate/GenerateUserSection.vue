<template>
    <div
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
<!--        <v-row justify="center" align="center" class="my-2">-->
<!--            <v-btn-->
<!--                color="primary"-->
<!--                icon="mdi-arrow-right"-->
<!--                variant="elevated"-->
<!--                aria-label="Continue"-->
<!--                :disabled="!hasUser"-->
<!--                @click="cont()"-->
<!--            ></v-btn>-->
<!--        </v-row>-->
    </div>
</template>
<script setup lang="ts">
const users = defineModel<string[]>(['']);
const hasUser = computed(() => users.value.filter(user=>user.length>0).length > 0);
const emit = defineEmits(['continue']);

function cont(){
    if(!hasUser.value) return;
    emit('continue');
}
</script>