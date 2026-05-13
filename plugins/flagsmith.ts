import { defineNuxtPlugin } from "#app";
import flagsmith from 'flagsmith'
import type { GetValueOptions, HasFeatureOptions, IFlagsmith, IState } from "flagsmith/types";

interface ClientFlagEntry {
    key: string;
    type: 'boolean' | 'number' | 'string';
    value: boolean | number | string;
    enabled: boolean;
}

interface ClientFlagsBundle {
    generatedAt: string;
    version: number;
    flags: ClientFlagEntry[];
}

const MINESKIN_FLAGS_URL = 'https://flags.mineskin.org/flags/client.json';
const FLAGSMITH_PROXY_API = 'https://flagsmith-proxy-worker.inventive.workers.dev/';
const FETCH_TIMEOUT_MS = 3000;

function bundleToFlagsmithState(bundle: ClientFlagsBundle, environmentID: string): IState {
    const flags: Record<string, { id: number; enabled: boolean; value: boolean | number | string | null }> = {};
    bundle.flags.forEach((entry, i) => {
        flags[entry.key] = {
            id: i + 1,
            enabled: entry.enabled,
            value: entry.type === 'boolean' ? null : entry.value
        };
    });
    return {
        api: MINESKIN_FLAGS_URL,
        environmentID,
        flags
    } as unknown as IState;
}

async function fetchMineskinBundle(): Promise<ClientFlagsBundle> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(MINESKIN_FLAGS_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`flags.mineskin.org HTTP ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

export default defineNuxtPlugin({
    name: 'flags',
    async setup(nuxtApp) {
        if (process.client) {
            const runtimeConfig = useRuntimeConfig();
            const environmentID = runtimeConfig.public.flagsmithEnvironment as string;

            let initialised = false;
            try {
                const bundle = await fetchMineskinBundle();
                await flagsmith.init({
                    environmentID,
                    api: MINESKIN_FLAGS_URL,
                    enableLogs: true,
                    preventFetch: true,
                    state: bundleToFlagsmithState(bundle, environmentID)
                });
                initialised = true;
            } catch (e) {
                console.warn('[flags] flags.mineskin.org unavailable, falling back to Flagsmith', e);
            }

            if (!initialised) {
                const state = await fetch('/flagsmith.json').then(res => res.json());
                await flagsmith.init({
                    environmentID,
                    api: FLAGSMITH_PROXY_API,
                    enableLogs: true,
                    cacheFlags: true,
                    state: state
                });
            }

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
