import type { SnackbarConfig } from "~/types/SnackbarConfig";

// https://github.com/alihdev/vuetify-helper/blob/main/snackbars-stack-way.md

export const useSnackbarStore = defineStore('snackbar', () => {
    const snackbars = ref<SnackbarConfig[]>([])
    const ids = ref(0)

    const theSizeOfSnackbar = 50

    const show = (config: Partial<SnackbarConfig>) => {
        snackbars.value.push({
            id: ++ids.value,
            text: config.text,
            color: config.color,
            show: true,
            actionLabel: config.actionLabel,
            actionLink: config.actionLink,
            position: theSizeOfSnackbar * snackbars.value.length,
        })
    }

    const showError = (message: string) => show(message, 'error')

    const remove = (id: number) => {
        const removedIdx = snackbars.value.findIndex(x => x.id === id)

        snackbars.value.splice(removedIdx, 1)
        snackbars.value.forEach((x, idx) => (x.position = theSizeOfSnackbar * idx))
    }

    return { snackbars, show, remove, showError }
})