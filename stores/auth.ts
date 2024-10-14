import type { Ref } from "vue";
import type { Maybe } from "~/types/util";
import type { AuthStatus } from "~/types/auth";

export const useAuthStore = defineStore('auth', () => {
    const {$mineskin, $account} = useNuxtApp();

    const router = useRouter();

    const authed: Ref<boolean> = ref(false);
    const _user: Ref<Maybe<any>> = ref(null);

    const lastTokenRefresh = ref(0);

    const checkAuth = async (): Promise<Maybe<AuthStatus>> => {
        console.debug('authStore.checkAuth');
        const response = await $mineskin.me.get();
        console.log(response)

        if (response.status === 401 || response.status === 404) {
            if (Date.now() - lastTokenRefresh.value > 1000 * 60 * 60 * 6) {
                if (await refreshWebAccessToken()) {
                    return checkAuth();
                }
            }
        }

        authed.value = response.ok;
        return {
            authenticated: authed.value
        };
    }

    const refreshWebAccessToken = async (): Promise<boolean> => {
        console.debug('authStore.refreshWebAccessToken');
        lastTokenRefresh.value = Date.now();
        let res = await $account.auth.refreshWebAccessToken();
        if (res?.status === 200) {
            return true;
        }
        return false;
    }

    return {
        authed,
        _user,
        lastTokenRefresh,
        refreshWebAccessToken,
        checkAuth,
    }
}, {
    persist: {
        storage: persistedState.localStorage,
        paths: ['lastTokenRefresh']
    }
});