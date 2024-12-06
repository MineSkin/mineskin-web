import type { RuntimeConfig } from "nuxt/schema";
import type { Maybe } from "@mineskin/types";

const INIT: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'MineSkin-User-Agent': 'MineSkin-Web'
    }
}

export class AccountAPI {

    BASE: string = '';

    constructor(readonly nuxtApp: any, readonly config: RuntimeConfig) {
        this.BASE = config.public.hosts.account;
        console.debug('API base', this.BASE)
    }

    public auth = new class {

        constructor(readonly api: AccountAPI) {
        }

        public async refreshWebAccessToken(): Promise<Maybe<Response>> {
            return fetch(`${ this.api.BASE }/auth/tokens/web/refresh`, {
                ...INIT,
                method: 'POST',
                credentials: 'include'
            }).catch(e => {
                console.error(e)
                return undefined;
            })
        }

        public async refreshApiAccessToken(): Promise<Maybe<Response>> {
            return fetch(`${ this.api.BASE }/auth/tokens/api/refresh`, {
                ...INIT,
                method: 'POST',
                credentials: 'include'
            }).catch(e => {
                console.error(e)
                return undefined;
            })
        }


    }(this);

}