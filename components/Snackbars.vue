<!-- https://github.com/alihdev/vuetify-helper/blob/main/snackbars-stack-way.md -->
<template>
    <VSnackbar
        v-for="(snackbar) in snackbars"
        :key="snackbar.id"
        v-model="snackbar.show"
        location="top right"
        variant="flat"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        :style="{ top: `${snackbar.position}px` }"
        @update:model-value="onChanged(snackbar.id, $event)"
    >
        <template v-slot:text>
            {{ snackbar.text }}
        </template>
        <template v-if="snackbar.actionLabel" v-slot:actions>
            <v-btn
                variant="text"
                v-if="snackbar.actionLabel && snackbar.actionLink"
                @click="router.push(snackbar.actionLink)"
            >
                {{ snackbar.actionLabel }}
            </v-btn>
        </template>
    </VSnackbar>
</template>
<script setup lang="ts">
const store = useSnackbarStore()
const { snackbars } = storeToRefs(store)

const router = useRouter();

const onChanged = (id: number, isShow: boolean) => !isShow && store.remove(id)
</script>