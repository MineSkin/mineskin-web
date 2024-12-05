import type { Ref } from "vue";
import type { Maybe } from "~/types/util";
import type { AuthStatus } from "~/types/auth";
import * as Sentry from "@sentry/browser"

const TOKEN_TIMEOUT = 1000 * 60 * 45;

export const useAuthStore = defineStore('auth', () => {
    const {$mineskin, $account} = useNuxtApp();

    const router = useRouter();

    const authed: Ref<boolean> = ref(false);
    const wasAuthed = ref(false);
    const _user: Ref<Maybe<AuthStatus>> = ref(null);

    const grants = ref<Record<string, string | number | boolean>>({});

    const lastWebTokenRefresh = ref(0);
    const lastApiTokenRefresh = ref(0);

    let _authCheckPromise: Promise<Maybe<AuthStatus>> | null = null;

    const checkAuth = async (): Promise<Maybe<AuthStatus>> => {
        if (!_authCheckPromise) {
            _authCheckPromise = checkAuth0().then(res => {
                _authCheckPromise = null;
                return res;
            });
        }
        return _authCheckPromise;
    }

    const checkAuth0 = async (): Promise<Maybe<AuthStatus>> => {
        console.debug('authStore.checkAuth');
        if (!process.client) return;

        const cookie = getWebTokenCookie();
        if (cookie) {
            const payload = parseWebAccessToken(cookie);
            if (payload) {
                console.debug(payload);
                grants.value = payload.grants;
                _user.value = {
                    user: payload.user,
                    email: payload.email,
                    grants: payload.grants,
                    picture: payload.picture
                };
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

        const response: Maybe<Response> = await $mineskin.me.get();
        console.log(response);


        if (response?.status === 401 || response?.status === 404) {
            if (Date.now() - lastApiTokenRefresh.value > TOKEN_TIMEOUT) {
                if (await refreshApiAccessToken()) {
                    return checkAuth0();
                }
            } else {
                console.debug('No api token cookie');
            }
        }

        const success = response && response.ok;
        authed.value = success;
        wasAuthed.value = success;
        $mineskin.setAuthed(success);

        if (success) {
            const body = await response.json();
            _user.value = {
                ...user.value || {},
                ...body,
                authenticated: success
            };
            grants.value = body.grants;
            try {
                Sentry.setUser({
                    id: _user.value?.user
                });
            } catch (e) {
                console.error(e);
            }
            return _user.value;
        }

        try {
            Sentry.setExtra('authed', authed.value);
        } catch (e) {
            console.error(e);
        }

        return {
            authenticated: authed.value
        };
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

    const getWebTokenCookie = (): Maybe<string> => {
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

    const user = computed(() => _user.value);
    const userId = computed(() => _user.value?.id);

    const reset = () => {
        authed.value = false;
        _user.value = null;
        grants.value = {};
        lastApiTokenRefresh.value = 0;
        lastWebTokenRefresh.value = 0;
    }

    return {
        authed,
        _user,
        lastWebTokenRefresh,
        lastApiTokenRefresh,
        refreshWebAccessToken,
        checkAuth,
        userId,
        user,
        grants,
        reset
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});