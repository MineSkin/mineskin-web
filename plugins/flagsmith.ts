import { defineNuxtPlugin } from "#app";
import flagsmith from 'flagsmith'
import type { GetValueOptions, HasFeatureOptions, IFlagsmith } from "flagsmith/types";
import { useAuthStore } from "~/stores/auth";

interface ClientFlagEntry {
    key: string;
    type: 'boolean' | 'number' | 'string';
    value: boolean | number | string;
    enabled: boolean;
    userOverrides?: Record<string, boolean | number | string>;
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

function resolveEntry(entry: ClientFlagEntry, userId?: string): { enabled: boolean; value: boolean | number | string; overridden: boolean } {
    const override = userId && entry.userOverrides ? entry.userOverrides[userId] : undefined;
    const overridden = override !== undefined;
    return {
        enabled: entry.enabled,
        value: overridden ? override : entry.value,
        overridden
    };
}

function wrapFlagsmith(
    target: IFlagsmith,
    overrides: Map<string, ClientFlagEntry>,
    getUserId: () => string | undefined
): IFlagsmith {
    if (overrides.size === 0) return target;
    return new Proxy(target, {
        get(t, prop, receiver) {
            if (prop === 'hasFeature') {
                return function (key: string, options?: HasFeatureOptions): boolean {
                    const entry = overrides.get(key);
                    if (entry) {
                        const { enabled, value, overridden } = resolveEntry(entry, getUserId());
                        if (entry.type === 'boolean') {
                            // A per-user override fully determines the flag for that
                            // user, bypassing the global enabled gate — so a flag kept
                            // off globally can still be turned on for specific testers.
                            if (overridden) return Boolean(value);
                            return enabled && Boolean(value);
                        }
                        return enabled;
                    }
                    return t.hasFeature(key, options);
                };
            }
            if (prop === 'getValue') {
                return function <T = any> (key: string, options?: GetValueOptions<T>, skipAnalytics?: boolean): any {
                    const entry = overrides.get(key);
                    if (entry) {
                        if (entry.type === 'boolean') return null;
                        return resolveEntry(entry, getUserId()).value;
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

            const getUserId = (): string | undefined => {
                try {
                    return useAuthStore().userId ?? undefined;
                } catch {
                    return undefined;
                }
            };

            const merged = wrapFlagsmith(flagsmith as IFlagsmith, buildMergedFlags(bundle), getUserId);

            return {
                provide: {
                    flags: merged
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
