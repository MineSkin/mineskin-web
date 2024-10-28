import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSkinStore = defineStore('skins', () => {

    const mySkins = ref<string[]>([]);

    const addSkin = (skinId: string) => {
        if (!mySkins.value.includes(skinId)) {
            mySkins.value.push(skinId);
        }
    }

    return {
        mySkins,
        addSkin
    }

}, {
    persist: {
        storage: persistedState.localStorage
    }
})