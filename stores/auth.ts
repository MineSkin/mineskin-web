import type { Ref } from "vue";
import type { Maybe } from "~/types/util";
import type { AuthStatus } from "~/types/auth";

const TOKEN_TIMEOUT = 1000 * 60 * 60 * 6;

export const useAuthStore = defineStore('auth', () => {
    const {$mineskin, $account} = useNuxtApp();

    const router = useRouter();

    const authed: Ref<boolean> = ref(false);
    const _user: Ref<Maybe<AuthStatus>> = ref(null);

    const lastWebTokenRefresh = ref(0);
    const lastApiTokenRefresh = ref(0);

    const checkAuth = async (): Promise<Maybe<AuthStatus>> => {
        console.debug('authStore.checkAuth');
        const response: Response = await $mineskin.me.get();
        console.log(response);

        const hasWebCookie = document.cookie.includes('mskweb');
        if (!hasWebCookie) {
            if (Date.now() - lastWebTokenRefresh.value > TOKEN_TIMEOUT) {
                await refreshWebAccessToken();
            }
        }

        if (response.status === 401 || response.status === 404) {
            if (Date.now() - lastApiTokenRefresh.value > TOKEN_TIMEOUT) {
                if (await refreshApiAccessToken()) {
                    return checkAuth();
                }
            }
        }

        const success = response.ok;
        authed.value = success;
        $mineskin.setAuthed(success);

        if (success) {
            const body = await response.json();
            _user.value = {
                ...body,
                authenticated: success
            };
            return _user.value;
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
        return false;
    }

    const refreshApiAccessToken = async (): Promise<boolean> => {
        console.debug('authStore.refreshApiAccessToken');
        lastApiTokenRefresh.value = Date.now();
        let res = await $account.auth.refreshApiAccessToken();
        if (res?.status === 200) {
            return true;
        }
        return false;
    }

    const userId = computed(() => _user.value?.id);
    const grants = computed(() => _user.value?.grants);

    return {
        authed,
        _user,
        lastWebTokenRefresh,
        lastApiTokenRefresh,
        refreshWebAccessToken,
        checkAuth,
        userId,
        grants
    }
}, {
    persist: {
        storage: persistedState.localStorage,
        paths: ['lastWebTokenRefresh', 'lastApiTokenRefresh']
    }
});