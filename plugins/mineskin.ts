import { MineSkinAPI } from "~/api/MineSkinAPI";

export default defineNuxtPlugin(nuxtApp => {
    const runtimeConfig = useRuntimeConfig();

    return {
        provide: {
            mineskin: new MineSkinAPI(nuxtApp, runtimeConfig)
        }
    }
})
