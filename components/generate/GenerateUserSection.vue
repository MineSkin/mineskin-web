<template>
    <div>
        <v-row justify="center" class="mb-2 flex-0-0">
            {{ $t("USER") }}
        </v-row>
        <InputList
            v-model="users"
            :label="$t('USER')"
            type="text"
            rule="user"
            prepend-icon="mdi-account"
            :image-provider="user=>userToImage(user)"
            :waiting="generating"
        />
        <v-row align="end">
            <v-col>
                {{ $t("Enter the Name or UUID of a user you want to generate data for") }}
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
import { useDebounceFn } from "@vueuse/core";

const users = defineModel<string[]>({required: true});
const hasUser = computed(() => users.value.filter(user => user.length > 0).length > 0);
const emit = defineEmits(['continue']);

const props = defineProps<{
    generating?: boolean
}>()


const {$mineskin} = useNuxtApp();

function cont() {
    if (!hasUser.value) return;
    emit('continue');
}


const userToImage = useDebounceFn(userToImage0, 500);

async function userToImage0(user: string) {
    console.debug('userToImage', user)
    let validation;
    if (user.length < 32) {
        validation = await $mineskin.validate.name(user);
    } else {
        validation = await $mineskin.validate.uuid(user);
    }
    if (!validation.valid) {
        return null;
    }
    return textureUrlForUuid(validation.uuid!);
}

</script>