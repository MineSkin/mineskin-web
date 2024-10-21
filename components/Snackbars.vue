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
        {{ snackbar.text }}
    </VSnackbar>
</template>
<script setup lang="ts">

const store = useSnackbarStore()

const { snackbars } = storeToRefs(store)

const onChanged = (id: number, isShow: boolean) => !isShow && store.remove(id)
</script>