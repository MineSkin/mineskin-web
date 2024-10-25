import { defineNuxtPlugin } from "#app";
import flagsmith from 'flagsmith'
import type { IFlagsmith } from "flagsmith/types";

export default defineNuxtPlugin({
    name: 'flags',
    async setup(nuxtApp) {
        if (process.client) {
            const runtimeConfig = useRuntimeConfig();
            const state = await fetch('/flagsmith.json').then(res => res.json());
            await flagsmith.init({
                environmentID: runtimeConfig.public.flagsmithEnvironment as string,
                enableLogs: true,
                cacheFlags: true,
                state: state
            })
        }
        return {
            provide: {
                flags: flagsmith as IFlagsmith
            }
        };
    }
});