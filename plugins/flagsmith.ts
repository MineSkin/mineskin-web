import { defineNuxtPlugin } from "#app";
import flagsmith from 'flagsmith'
import type { GetValueOptions, HasFeatureOptions, IFlagsmith } from "flagsmith/types";

export default defineNuxtPlugin({
    name: 'flags',
    async setup(nuxtApp) {
        if (process.client) {
            const runtimeConfig = useRuntimeConfig();
            const state = await fetch('/flagsmith.json').then(res => res.json());
            await flagsmith.init({
                environmentID: runtimeConfig.public.flagsmithEnvironment as string,
                api: 'https://flagsmith-proxy-worker.inventive.workers.dev/',
                enableLogs: true,
                cacheFlags: true,
                state: state
            });
            return {
                provide: {
                    flags: flagsmith as IFlagsmith
                }
            };
        }
        return {
            provide: {
                // server polyfill
                flags: {
                    hasFeature: (key: string, options?: HasFeatureOptions): boolean => {
                        return (typeof options === "object" && options?.fallback) || false;
                    },
                    getValue: <T = any>(key: string, options?: GetValueOptions<T>, skipAnalytics?: boolean): any => {
                        return options?.fallback || undefined;
                    }
                } as IFlagsmith
            }
        }
    }
});