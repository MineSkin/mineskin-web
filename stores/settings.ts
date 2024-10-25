import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSettingsStore = defineStore('settings', () => {

    const visibility = ref<SkinVisibility2>(SkinVisibility2.PUBLIC);

    return {
        visibility
    }

}, {
    persist: {
        storage: persistedState.localStorage
    }
})