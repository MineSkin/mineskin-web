import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSettingsStore = defineStore('settings', () => {

    const visibility = ref<SkinVisibility2>(SkinVisibility2.PUBLIC);
    const newWebsiteBannerClosed = ref<number>(0);

    return {
        visibility,
        newWebsiteBannerClosed
    }

}, {
    persist: {
        storage: persistedState.localStorage
    }
})