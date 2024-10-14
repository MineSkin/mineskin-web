import type { RuntimeConfig } from "nuxt/schema";
import type { Maybe } from "@mineskin/types";

const INIT: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
            return fetch(`${ this.api.BASE }/auth/refresh`, {
                ...INIT,
                method: 'POST'
            })
        }


    }(this);

}