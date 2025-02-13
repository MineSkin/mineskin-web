import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useInteractionsStore = defineStore('interactions', () => {

    const recentViews = ref<string[]>([]);

    return {
        recentViews
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
})