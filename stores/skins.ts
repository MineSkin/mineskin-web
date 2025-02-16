import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSkinStore = defineStore('skins', () => {

    const mySkins = ref<string[]>([]);
    const legacySkins = ref<string[]>([]);

    const addSkin = (skinId: string) => {
        if (!mySkins.value.includes(skinId)) {
            mySkins.value.push(skinId);
        }
        if (mySkins.value.length > 100) {
            mySkins.value.shift();
        }
    }

    const addLegacySkin = (skinId: string) => {
        if (!legacySkins.value.includes(skinId)) {
            legacySkins.value.push(skinId);
        }
        if (legacySkins.value.length > 100) {
            legacySkins.value.shift();
        }
    }

    return {
        mySkins,
        legacySkins,
        addSkin,
        addLegacySkin
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
})