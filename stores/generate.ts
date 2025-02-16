import { defineStore, skipHydrate, storeToRefs } from "pinia";
import { GenerateType, type Maybe, SkinVariant, SkinVisibility2 } from "@mineskin/types";
import { computed, ref } from "vue";
import { type FileJson } from "~/util/file";
import destr from "destr";

export const useGenerateStore = defineStore('generate', () => {

    const name = ref<string>('');
    const visibility = ref<SkinVisibility2>(SkinVisibility2.PUBLIC);
    const variant = ref<SkinVariant>(SkinVariant.UNKNOWN);

    const uploadFiles = ref<FileJson[]>([]);
    const urls = ref<string[]>([]);
    const users = ref<string[]>([]);

    const generating = ref(false);

    return {
        name,
        visibility,
        variant,

        uploadFiles,
        urls,
        users,

        generating
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        serializer: {
            serialize: value => {
                const copy = {...value};
                copy.urls = (value.urls as string[]).filter(url => url.length > 0);
                copy.users = (value.users as string[]).filter(user => user.length > 0);
                return JSON.stringify(copy);
            },
            deserialize: destr
        }
    }
})