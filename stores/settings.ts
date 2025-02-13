import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSettingsStore = defineStore('settings', () => {

    const visibility = ref<SkinVisibility2>(SkinVisibility2.PUBLIC);
    const newWebsiteBannerClosed = ref<number>(0);
    const skinView3D = ref<boolean>(false);

    return {
        visibility,
        newWebsiteBannerClosed,
        skinView3D
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
})