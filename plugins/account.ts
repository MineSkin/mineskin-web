import { AccountAPI } from "~/api/AccountAPI";

export default defineNuxtPlugin(nuxtApp => {
    const runtimeConfig = useRuntimeConfig();

    return {
        provide: {
            account: new AccountAPI(nuxtApp, runtimeConfig)
        }
    }
})
