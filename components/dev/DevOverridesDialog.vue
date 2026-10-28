<style scoped>
.dev-overrides-fab {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 1005;
}

.dev-overrides-table td {
    vertical-align: middle;
}

.dev-overrides-value {
    max-width: 180px;
}

.dev-overrides-input {
    min-width: 140px;
}
</style>
<template>
    <div class="dev-overrides-fab" v-show="!devOverrides.panelOpen">
        <v-btn
            size="small"
            :color="overriding ? 'warning' : 'surface-variant'"
            variant="flat"
            prepend-icon="mdi-tune-variant"
            @click="devOverrides.panelOpen = true"
        >
            Dev overrides
            <v-chip v-if="overriding" size="x-small" variant="flat" color="black" class="ml-2">
                {{ devOverrides.count }}
            </v-chip>
        </v-btn>
    </div>

    <v-dialog v-model="devOverrides.panelOpen" width="820" max-width="100%" scrollable :fullscreen="xs">
        <v-card>
            <v-card-title class="d-flex align-center flex-wrap ga-2">
                <v-icon icon="mdi-tune-variant"/>
                <span>Dev overrides</span>
                <v-spacer/>
                <v-switch
                    v-model="devOverrides.enabled"
                    :label="devOverrides.enabled ? 'Applied' : 'Paused'"
                    color="warning"
                    density="compact"
                    hide-details
                    inset
                />
            </v-card-title>
            <v-card-subtitle class="pb-2">
                Saved in this browser only. Ignored outside <code>yarn dev</code>.
            </v-card-subtitle>

            <v-tabs v-model="tab" density="compact" color="warning">
                <v-tab value="account">Account</v-tab>
                <v-tab value="grants">
                    Grants
                    <v-chip v-if="grantOverrideCount" size="x-small" class="ml-2">{{ grantOverrideCount }}</v-chip>
                </v-tab>
                <v-tab value="flags">
                    Flags
                    <v-chip v-if="flagOverrideCount" size="x-small" class="ml-2">{{ flagOverrideCount }}</v-chip>
                </v-tab>
            </v-tabs>
            <v-divider/>

            <v-card-text style="height: 60vh">
                <v-window v-model="tab">
                    <v-window-item value="account">
                        <div class="text-subtitle-2 mb-2">Presets</div>
                        <div class="d-flex flex-wrap ga-2 mb-6">
                            <v-btn
                                v-for="preset in PRESETS"
                                :key="preset.value"
                                variant="tonal"
                                size="small"
                                @click="devOverrides.applyPreset(preset.value)"
                            >
                                {{ preset.title }}
                            </v-btn>
                        </div>

                        <div class="text-subtitle-2 mb-2">Signed in</div>
                        <v-btn-toggle
                            :model-value="authMode"
                            @update:model-value="setAuthMode"
                            mandatory
                            density="compact"
                            variant="outlined"
                            divided
                            class="mb-2"
                        >
                            <v-btn value="real">Real ({{ authStore._authed ? 'signed in' : 'signed out' }})</v-btn>
                            <v-btn value="in">Signed in</v-btn>
                            <v-btn value="out">Signed out</v-btn>
                        </v-btn-toggle>
                        <v-alert
                            v-if="devOverrides.authed === true && !authStore._authed"
                            type="info"
                            variant="tonal"
                            density="compact"
                            class="mb-4"
                        >
                            Fake sign-in only unlocks the UI. API requests still use your real (signed out) session,
                            so My Skins, collections and export stay empty.
                        </v-alert>

                        <div class="text-subtitle-2 mt-4 mb-2">User</div>
                        <v-text-field
                            v-for="field in USER_FIELDS"
                            :key="field.key"
                            v-model="devOverrides.user[field.key]"
                            :label="field.label"
                            :placeholder="String(authStore._user?.[field.key] || DEV_USER[field.key] || '')"
                            persistent-placeholder
                            density="compact"
                            clearable
                            class="mb-1"
                        />
                    </v-window-item>

                    <v-window-item value="grants">
                        <v-table density="compact" class="dev-overrides-table">
                            <thead>
                            <tr>
                                <th>Grant</th>
                                <th>Real</th>
                                <th>Override</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="key in grantKeys" :key="key">
                                <td>
                                    <code :class="{'text-warning': key in devOverrides.grants}">{{ key }}</code>
                                </td>
                                <td class="text-medium-emphasis">{{ formatValue(authStore._grants?.[key]) }}</td>
                                <td>
                                    <v-btn-toggle
                                        v-if="grantType(key) === 'boolean'"
                                        :model-value="key in devOverrides.grants ? String(devOverrides.grants[key]) : 'real'"
                                        @update:model-value="(v: string) => devOverrides.setGrant(key, v === 'real' ? null : v === 'true')"
                                        mandatory
                                        density="compact"
                                        variant="outlined"
                                        divided
                                    >
                                        <v-btn value="real" size="small">Real</v-btn>
                                        <v-btn value="true" size="small">True</v-btn>
                                        <v-btn value="false" size="small">False</v-btn>
                                    </v-btn-toggle>
                                    <v-text-field
                                        v-else
                                        :model-value="devOverrides.grants[key] ?? ''"
                                        @update:model-value="(v: string | null) => setGrantInput(key, v)"
                                        :type="grantType(key) === 'number' ? 'number' : 'text'"
                                        placeholder="real"
                                        density="compact"
                                        variant="outlined"
                                        hide-details
                                        clearable
                                        class="dev-overrides-input"
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </v-table>

                        <div class="d-flex flex-wrap align-center ga-2 mt-4">
                            <v-text-field
                                v-model="newGrantKey"
                                label="Custom grant"
                                density="compact"
                                hide-details
                                class="dev-overrides-input"
                            />
                            <v-text-field
                                v-model="newGrantValue"
                                label="Value"
                                placeholder="true / 12 / text"
                                density="compact"
                                hide-details
                                class="dev-overrides-input"
                                @keydown.enter="addCustomGrant"
                            />
                            <v-btn variant="tonal" :disabled="!newGrantKey" @click="addCustomGrant">Add</v-btn>
                        </div>
                    </v-window-item>

                    <v-window-item value="flags">
                        <v-text-field
                            v-model="flagSearch"
                            prepend-inner-icon="mdi-magnify"
                            placeholder="Search all flags, or type a new flag key"
                            density="compact"
                            hide-details
                            clearable
                            class="mb-2"
                        />
                        <v-table density="compact" class="dev-overrides-table">
                            <thead>
                            <tr>
                                <th>Flag</th>
                                <th>Real</th>
                                <th>Override</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="row in flagRows" :key="row.key">
                                <td>
                                    <code :class="{'text-warning': row.key in devOverrides.flags}">{{ row.key }}</code>
                                    <span v-if="row.seen">
                                        <v-icon icon="mdi-circle-small" color="success"/>
                                        <v-tooltip activator="parent" location="top">Used since page load</v-tooltip>
                                    </span>
                                    <v-chip v-if="row.custom" size="x-small" class="ml-1">new</v-chip>
                                </td>
                                <td>
                                    <div class="d-flex align-center ga-1">
                                        <v-chip size="x-small" :color="row.realOn ? 'success' : undefined">
                                            {{ row.realOn ? 'on' : 'off' }}
                                        </v-chip>
                                        <span v-if="row.realValue !== undefined"
                                              class="text-caption text-medium-emphasis text-truncate dev-overrides-value"
                                              :title="String(row.realValue)">
                                            {{ row.realValue }}
                                        </span>
                                    </div>
                                </td>
                                <td class="py-1">
                                    <v-btn-toggle
                                        :model-value="flagMode(row.key)"
                                        @update:model-value="(v: string) => setFlagMode(row.key, v)"
                                        mandatory
                                        density="compact"
                                        variant="outlined"
                                        divided
                                    >
                                        <v-btn value="real" size="small">Real</v-btn>
                                        <v-btn value="on" size="small">On</v-btn>
                                        <v-btn value="off" size="small">Off</v-btn>
                                    </v-btn-toggle>
                                    <v-text-field
                                        v-if="row.key in devOverrides.flags"
                                        :model-value="devOverrides.flags[row.key]?.value ?? ''"
                                        @update:model-value="(v: string | null) => setFlagValue(row.key, v)"
                                        placeholder="real"
                                        density="compact"
                                        variant="outlined"
                                        hide-details
                                        clearable
                                        class="dev-overrides-input mt-1"
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </v-table>
                    </v-window-item>
                </v-window>
            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-btn color="error" variant="text" :disabled="!devOverrides.count" @click="devOverrides.reset()">
                    Clear all
                </v-btn>
                <v-spacer/>
                <v-btn variant="text" @click="reload">Reload page</v-btn>
                <v-btn color="primary" variant="flat" @click="devOverrides.panelOpen = false">Done</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import {
    DEV_USER,
    type DevPreset,
    type GrantValue,
    KNOWN_GRANTS,
    type UserOverride,
    useDevOverridesStore
} from "~/stores/devOverrides";

const PRESETS: { title: string; value: DevPreset }[] = [
    {title: 'Signed out', value: 'signed-out'},
    {title: 'Free user', value: 'free'},
    {title: 'Plus member', value: 'plus'},
    {title: 'Pro member', value: 'pro'}
];

const USER_FIELDS: { key: keyof UserOverride; label: string }[] = [
    {key: 'user', label: 'User ID'},
    {key: 'email', label: 'Email'},
    {key: 'picture', label: 'Picture URL'}
];

const {xs} = useDisplay();

const authStore = useAuthStore();
const devOverrides = useDevOverridesStore();

const tab = ref('account');

const overriding = computed(() => devOverrides.active && devOverrides.count > 0);
const grantOverrideCount = computed(() => Object.keys(devOverrides.grants).length);
const flagOverrideCount = computed(() => Object.keys(devOverrides.flags).length);

const formatValue = (value: unknown) => value === undefined || value === null ? '—' : String(value);

const authMode = computed(() => devOverrides.authed === null ? 'real' : devOverrides.authed ? 'in' : 'out');
const setAuthMode = (mode: string) => {
    devOverrides.authed = mode === 'real' ? null : mode === 'in';
}

const grantKeys = computed(() => {
    return [...new Set([
        ...Object.keys(KNOWN_GRANTS),
        ...Object.keys(authStore._grants || {}),
        ...Object.keys(devOverrides.grants)
    ])].sort();
});

const grantType = (key: string): 'boolean' | 'number' | 'string' => {
    const sample = devOverrides.grants[key] ?? authStore._grants?.[key] ?? KNOWN_GRANTS[key];
    if (typeof sample === 'boolean') return 'boolean';
    if (typeof sample === 'number') return 'number';
    return 'string';
}

const setGrantInput = (key: string, value: string | null) => {
    if (value === null || value === '') {
        devOverrides.setGrant(key, null);
        return;
    }
    devOverrides.setGrant(key, grantType(key) === 'number' ? Number(value) : value);
}

const newGrantKey = ref('');
const newGrantValue = ref('');

const parseGrantValue = (value: string): GrantValue => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value !== '' && !isNaN(Number(value))) return Number(value);
    return value;
}

const addCustomGrant = () => {
    const key = newGrantKey.value.trim();
    if (!key) return;
    devOverrides.setGrant(key, parseGrantValue(newGrantValue.value.trim()));
    newGrantKey.value = '';
    newGrantValue.value = '';
}

const flagSearch = ref('');

const flagRows = computed(() => {
    const realFlags = devOverrides.getRealFlags();
    const seen = new Set(devOverrides.seenFlags);
    const keys = new Set([
        ...devOverrides.knownFlags,
        ...devOverrides.seenFlags,
        ...Object.keys(devOverrides.flags)
    ]);
    const search = (flagSearch.value || '').trim();
    const sorted = [...keys]
        // flagsmith is shared with other apps; only list web flags unless searching
        .filter(key => search ? key.includes(search) : key.startsWith('web.') || seen.has(key) || key in devOverrides.flags)
        .sort((a, b) => Number(seen.has(b)) - Number(seen.has(a)) || a.localeCompare(b));
    // lets you override a flag the app hasn't asked for yet
    if (search && !keys.has(search)) sorted.push(search);
    return sorted
        .map(key => {
            const realValue = realFlags?.getValue(key, undefined, true);
            return {
                key,
                seen: seen.has(key),
                custom: !keys.has(key),
                realOn: realFlags?.hasFeature(key) || false,
                realValue: realValue === null ? undefined : realValue
            };
        });
});

const flagMode = (key: string) => {
    const override = devOverrides.flags[key];
    if (!override) return 'real';
    return override.enabled ? 'on' : 'off';
}

const setFlagMode = (key: string, mode: string) => {
    if (mode === 'real') {
        devOverrides.setFlag(key, null);
        return;
    }
    devOverrides.setFlag(key, {
        ...devOverrides.flags[key],
        enabled: mode === 'on'
    });
}

const setFlagValue = (key: string, value: string | null) => {
    devOverrides.setFlag(key, {
        enabled: devOverrides.flags[key]?.enabled ?? true,
        value: value || undefined
    });
}

const reload = () => {
    window.location.reload();
}
</script>
