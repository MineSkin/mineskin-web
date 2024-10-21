<template>
    <div>
        <v-row justify="center" class="mb-2 flex-0-0">
            USER
        </v-row>
        <InputList
            v-model="users"
            label="USER"
            type="text"
            rule="user"
            prepend-icon="mdi-account"
            :image-provider="user=>userToImage(user)"
        />
        <v-row align="end">
            <v-col>
                Enter the Name or UUID of a user you want to generate data for
            </v-col>
        </v-row>
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
import InputList from "./list/InputList.vue";
import { textureUrlForUuid } from "../../util/render";

const users = defineModel<string[]>(['']);
const hasUser = computed(() => users.value.filter(user => user.length > 0).length > 0);
const emit = defineEmits(['continue']);

const {$mineskin} = useNuxtApp();

function cont() {
    if (!hasUser.value) return;
    emit('continue');
}


async function userToImage(user: string) {
    console.debug('userToImage', user)
    let validation;
    if (user.length < 32) {
        validation = await $mineskin.validate.name(user);
    } else {
        validation = await $mineskin.validate.uuid(user);
    }
    if (!validation.valid) {
    }
    return null;
    return textureUrlForUuid(validation.uuid!);
}

</script>