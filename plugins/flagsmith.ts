import { defineNuxtPlugin } from "#app";
import flagsmith from 'flagsmith'
import type { GetValueOptions, HasFeatureOptions, IFlagsmith } from "flagsmith/types";

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

async function fetchMineskinBundle(): Promise<ClientFlagsBundle | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(MINESKIN_FLAGS_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`flags.mineskin.org HTTP ${ res.status }`);
        return await res.json();
    } catch (e) {
        console.warn('[flags] flags.mineskin.org unavailable, using Flagsmith only', e);
        return null;
    } finally {
        clearTimeout(timer);
    }
}

function buildMergedFlags(bundle: ClientFlagsBundle | null): Map<string, ClientFlagEntry> {
    const map = new Map<string, ClientFlagEntry>();
    if (!bundle) return map;
    for (const entry of bundle.flags) {
        map.set(entry.key, entry);
    }
    return map;
}

function wrapFlagsmith(target: IFlagsmith, overrides: Map<string, ClientFlagEntry>): IFlagsmith {
    if (overrides.size === 0) return target;
    return new Proxy(target, {
        get(t, prop, receiver) {
            if (prop === 'hasFeature') {
                return function (key: string, options?: HasFeatureOptions): boolean {
                    if (overrides.has(key)) return overrides.get(key)!.enabled;
                    return t.hasFeature(key, options);
                };
            }
            if (prop === 'getValue') {
                return function <T = any> (key: string, options?: GetValueOptions<T>, skipAnalytics?: boolean): any {
                    if (overrides.has(key)) {
                        const entry = overrides.get(key)!;
                        return entry.type === 'boolean' ? null : entry.value;
                    }
                    return t.getValue(key, options, skipAnalytics);
                };
            }
            const value = Reflect.get(t, prop, receiver);
            return typeof value === 'function' ? value.bind(t) : value;
        }
    }) as IFlagsmith;
}

export default defineNuxtPlugin({
    name: 'flags',
    async setup(nuxtApp) {
        if (process.client) {
            const runtimeConfig = useRuntimeConfig();
            const environmentID = runtimeConfig.public.flagsmithEnvironment as string;

            const [bundle, state] = await Promise.all([
                fetchMineskinBundle(),
                fetch('/flagsmith.json').then(res => res.json())
            ]);

            await flagsmith.init({
                environmentID,
                api: FLAGSMITH_PROXY_API,
                enableLogs: true,
                cacheFlags: true,
                state: state
            });

            const overrides = buildMergedFlags(bundle);
            return {
                provide: {
                    flags: wrapFlagsmith(flagsmith as IFlagsmith, overrides)
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
