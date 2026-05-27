import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useSkinStore = defineStore('skins', () => {

    const mySkins = ref<string[]>([]);
    const legacySkins = ref<string[]>([]);
    const anonId = ref<string | null>(null);

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

    const ensureAnonId = (): string => {
        if (!anonId.value) {
            anonId.value = crypto.randomUUID().replace(/-/g, '');
        }
        return anonId.value;
    }

    const clearAnonId = () => {
        anonId.value = null;
    }

    return {
        mySkins,
        legacySkins,
        anonId,
        addSkin,
        addLegacySkin,
        ensureAnonId,
        clearAnonId
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
})