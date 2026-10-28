import type { Ref } from "vue";
import type { AuthStatus } from "~/types/auth";
import * as Sentry from "@sentry/browser"
import { useSkinStore } from "~/stores/skins";
import { DEV_USER, useDevOverridesStore } from "~/stores/devOverrides";
import destr from "destr";

const TOKEN_TIMEOUT = 1000 * 60 * 45;

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig();
    const {$mineskin, $account, $flags} = useNuxtApp();

    const router = useRouter();

    // real state from the backend; read through the computed authed/grants/user below
    const _authed: Ref<boolean> = ref(false);
    const wasAuthed = ref(false);
    const _user: Ref<AuthStatus | null> = ref(null);

    const _grants = ref<Record<string, string | number | boolean>>({});

    const devOverrides = config.public.isDev ? useDevOverridesStore() : null;

    const authed = computed(() => {
        if (devOverrides?.active && devOverrides.authed !== null) return devOverrides.authed;
        return _authed.value;
    });

    const grants = computed(() => {
        if (!devOverrides?.active) return _grants.value;
        return {
            ..._grants.value || {},
            ...devOverrides.grants
        };
    });

    const lastWebTokenRefresh = ref(0);
    const lastApiTokenRefresh = ref(0);

    let _authCheckPromise: Promise<AuthStatus | null> | null = null;

    const checkAuth = async (): Promise<AuthStatus | null> => {
        if (!_authCheckPromise) {
            _authCheckPromise = checkAuth0()
                .then(res => {
                    _authCheckPromise = null;
                    return res;
                })
                .catch(e => {
                    console.error(e);
                    _authCheckPromise = null;
                    return {
                        authenticated: false
                    } as AuthStatus;
                })
        }
        return await _authCheckPromise;
    }

    const checkAuth0 = async (): Promise<AuthStatus | null> => {
        console.debug('authStore.checkAuth');
        if (!process.client) return null;

        const cookie = getWebTokenCookie();
        if (cookie) {
            const payload = parseWebAccessToken(cookie);
            if (payload) {
                console.debug(payload);
                _grants.value = payload.grants;
                _user.value = {
                    user: payload.user,
                    email: payload.email,
                    grants: payload.grants,
                    picture: payload.picture
                } as AuthStatus;
            }
        }

        const hasWebCookie = document.cookie.includes('mskweb');
        if (!hasWebCookie) {
            if (Date.now() - lastWebTokenRefresh.value > TOKEN_TIMEOUT) {
                await refreshWebAccessToken();
            } else {
                console.debug('No web token cookie');
            }
        }

        const response: Response | void = await $mineskin.me.get();
        console.log(response);


        if (response?.status === 401 || response?.status === 404) {
            if (Date.now() - lastApiTokenRefresh.value > TOKEN_TIMEOUT) {
                if (await refreshApiAccessToken()) {
                    return await checkAuth0();
                }
            } else {
                console.debug('No api token cookie');
            }
        }

        const success = !!response && response.ok;
        _authed.value = success;
        wasAuthed.value = success;
        $mineskin.setAuthed(success);

        if (success) {
            const body = await response.json();
            _user.value = {
                ..._user.value || {},
                ...body,
                authenticated: success
            };
            _grants.value = body.grants;
            try {
                Sentry.setUser({
                    id: _user.value?.user
                });
            } catch (e) {
                console.error(e);
            }
            linkAnonymousSkins();
            return user.value;
        }

        try {
            Sentry.setExtra('authed', authed.value);
        } catch (e) {
            console.error(e);
        }

        return {
            authenticated: authed.value
        } as AuthStatus;
    }

    const refreshWebAccessToken = async (): Promise<boolean> => {
        console.debug('authStore.refreshWebAccessToken');
        lastWebTokenRefresh.value = Date.now();
        let res = await $account.auth.refreshWebAccessToken();
        if (res?.status === 200) {
            return true;
        }
        lastWebTokenRefresh.value = Date.now() - TOKEN_TIMEOUT + 5000;
        return false;
    }

    const refreshApiAccessToken = async (): Promise<boolean> => {
        console.debug('authStore.refreshApiAccessToken');
        lastApiTokenRefresh.value = Date.now();
        let res = await $account.auth.refreshApiAccessToken();
        if (res?.status === 200) {
            return true;
        }
        lastApiTokenRefresh.value = Date.now() - TOKEN_TIMEOUT + 5000;
        return false;
    }

    const linkAnonymousSkins = () => {
        if (!$flags.hasFeature('web.anon_link.enabled')) return;
        const skinStore = useSkinStore();
        const anonId = skinStore.anonId;
        if (!anonId) return;
        $mineskin.me.linkAnonymous(anonId)
            .then(res => {
                if ((res as any)?.linked > 0) {
                    skinStore.clearAnonId();
                }
            })
            .catch(e => {
                console.error('Failed to link anonymous skins', e);
                try {
                    Sentry.captureException(e);
                } catch {}
            });
    }

    const getWebTokenCookie = (): string | undefined => {
        return document.cookie.split('; ').find(row => row.startsWith('mskweb'))?.split('=')[1];
    }

    const parseWebAccessToken = (token: string): any => {
        // https://stackoverflow.com/a/38552302/6257838
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const user = computed((): AuthStatus | null => {
        if (!devOverrides?.active) return _user.value;
        if (!authed.value) return devOverrides.authed === false ? null : _user.value;
        const overrides = Object.fromEntries(Object.entries(devOverrides.user).filter(([, v]) => !!v));
        return {
            ...(_user.value?.user ? _user.value : DEV_USER),
            ...overrides,
            grants: grants.value,
            authenticated: true
        } as AuthStatus;
    });
    const userId = computed(() => user.value?.user);

    const reset = () => {
        _authed.value = false;
        _user.value = null;
        _grants.value = {};
        lastApiTokenRefresh.value = 0;
        lastWebTokenRefresh.value = 0;
    }

    watch(grants, (newGrants) => {
        if (!newGrants || !('ad_free' in newGrants)) return;
        const win = window as any;
        if ('grantAdFreePromiseResolve' in win && typeof win.grantAdFreePromiseResolve === 'function') {
            win.grantAdFreePromiseResolve(newGrants?.ad_free || false);
        }
    }, {immediate: true})

    return {
        _authed,
        authed,
        _user,
        lastWebTokenRefresh,
        lastApiTokenRefresh,
        refreshWebAccessToken,
        checkAuth,
        userId,
        user,
        _grants,
        grants,
        reset
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['_authed', '_user', '_grants', 'lastWebTokenRefresh', 'lastApiTokenRefresh'],
        serializer: {
            serialize: JSON.stringify,
            deserialize: value => {
                const state = destr<Record<string, any>>(value);
                // migrate state persisted before authed/grants were renamed to _authed/_grants
                if (state && 'authed' in state && !('_authed' in state)) {
                    state._authed = state.authed;
                    state._grants = state.grants;
                }
                return state;
            }
        }
    }
});