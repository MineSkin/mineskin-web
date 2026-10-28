import { defineStore } from "pinia";
import type { IFlagsmith } from "flagsmith/types";

export type GrantValue = string | number | boolean;

export interface FlagOverride {
    enabled: boolean;
    // empty/undefined falls back to the real flag value
    value?: string;
}

export interface UserOverride {
    user?: string;
    email?: string;
    picture?: string;
}

export type DevPreset = 'signed-out' | 'free' | 'plus' | 'pro';

// mirrors the user grants of the plans in account-api (billing/Products.ts)
const FREE_GRANTS: Record<string, GrantValue> = {
    plan: 'free',
    ad_free: false,
    private_skins: false,
    private_collections: false,
    capes: false,
    owned_capes: false,
    early_access: false,
    auto_retry: false,
    skin_history_unlimited: false
};
const PLUS_GRANTS: Record<string, GrantValue> = {
    plan: 'plus',
    ad_free: true,
    private_skins: true,
    private_collections: true,
    collection_limit: 50,
    collection_skin_limit: 1000,
    capes: true,
    owned_capes: true,
    early_access: true,
    auto_retry: true,
    skin_edit_duration: 24 * 90,
    skin_delete_duration: 24 * 90,
    skin_history_unlimited: true
};
const PRO_GRANTS: Record<string, GrantValue> = {
    ...PLUS_GRANTS,
    plan: 'pro',
    team_create: true,
    collection_limit: 100,
    collection_skin_limit: 5000,
    batch_generation: true,
    skin_edit_duration: 24 * 180,
    skin_delete_duration: 24 * 180
};

// grants the panel always lists, with an example value to infer the input type
export const KNOWN_GRANTS: Record<string, GrantValue> = {
    ...PRO_GRANTS,
    per_minute: 20
};

export const DEV_USER: UserOverride = {
    user: 'dev-user',
    email: 'dev@localhost'
};

// the unwrapped flags (without dev overrides), so the panel can show real values
let realFlags: IFlagsmith | null = null;
const seenFlagKeys = new Set<string>();

/**
 * Local-only overrides for auth state, grants and feature flags.
 * Only applied when runtimeConfig.public.isDev is set (i.e. `nuxt dev`).
 */
export const useDevOverridesStore = defineStore('devOverrides', () => {
    const config = useRuntimeConfig();

    const enabled = ref(true);
    // null = use the real value
    const authed = ref<boolean | null>(null);
    const user = ref<UserOverride>({});
    const grants = ref<Record<string, GrantValue>>({});
    const flags = ref<Record<string, FlagOverride>>({});

    const panelOpen = ref(false);
    // flags known to flagsmith / flags.mineskin.org
    const knownFlags = ref<string[]>([]);
    // flags the app has asked for since page load
    const seenFlags = ref<string[]>([]);

    const active = computed(() => !!config.public.isDev && enabled.value);

    const count = computed(() => {
        return (authed.value !== null ? 1 : 0)
            + Object.values(user.value).filter(v => !!v).length
            + Object.keys(grants.value).length
            + Object.keys(flags.value).length;
    });

    const setGrant = (key: string, value: GrantValue | null) => {
        const copy = {...grants.value};
        if (value === null) {
            delete copy[key];
        } else {
            copy[key] = value;
        }
        grants.value = copy;
    }

    const setFlag = (key: string, value: FlagOverride | null) => {
        const copy = {...flags.value};
        if (value === null) {
            delete copy[key];
        } else {
            copy[key] = value;
        }
        flags.value = copy;
    }

    const applyPreset = (preset: DevPreset) => {
        switch (preset) {
            case 'signed-out':
                authed.value = false;
                grants.value = {};
                break;
            case 'free':
                authed.value = true;
                grants.value = {...FREE_GRANTS};
                break;
            case 'plus':
                authed.value = true;
                grants.value = {...PLUS_GRANTS};
                break;
            case 'pro':
                authed.value = true;
                grants.value = {...PRO_GRANTS};
                break;
        }
        enabled.value = true;
    }

    const reset = () => {
        authed.value = null;
        user.value = {};
        grants.value = {};
        flags.value = {};
    }

    const markFlagSeen = (key: string) => {
        if (seenFlagKeys.has(key)) return;
        seenFlagKeys.add(key);
        seenFlags.value.push(key);
    }

    const setRealFlags = (flagsmith: IFlagsmith, keys: string[]) => {
        realFlags = flagsmith;
        knownFlags.value = [...new Set(keys)];
    }

    const getRealFlags = () => realFlags;

    return {
        enabled,
        authed,
        user,
        grants,
        flags,
        panelOpen,
        knownFlags,
        seenFlags,
        active,
        count,
        setGrant,
        setFlag,
        applyPreset,
        reset,
        markFlagSeen,
        setRealFlags,
        getRealFlags
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['enabled', 'authed', 'user', 'grants', 'flags']
    }
});
