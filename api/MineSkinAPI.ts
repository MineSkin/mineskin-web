import type { RuntimeConfig } from "nuxt/schema";
import type { GenerateOptions } from "~/types/GenerateOptions";
import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinResponse } from "~/types/SkinResponse";
import type { SkinListResponse } from "~/types/SkinListResponse";

const INIT: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

export class MineSkinAPI {

    BASE: string = '';

    constructor(readonly nuxtApp: any, readonly config: RuntimeConfig) {
        this.BASE = config.public.hosts.mineskin;
        console.debug('API base', this.BASE)
    }

    public generate = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async upload(file: File, options: GenerateOptions): Promise<SkinResponse> {
            const formData = new FormData();
            formData.append('file', file);
            if (options.visibility) {
                formData.append('visibility', options.visibility);
            }
            if (options.variant) {
                formData.append('variant', options.variant);
            }
            if (options.name) {
                formData.append('name', options.name);
            }
            return fetch(`${ this.api.BASE }/v2/generate`, {
                ...INIT,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: formData
            })
                .then(res => this.api.handleResponse(res));
        }

        public async url(url: string, options: GenerateOptions): Promise<SkinResponse> {
            const body = {
                url
            };
            if (options.visibility) {
                body['visibility'] = options.visibility;
            }
            if (options.variant) {
                body['variant'] = options.variant;
            }
            if (options.name) {
                body['name'] = options.name;
            }
            return fetch(`${ this.api.BASE }/v2/generate`, {
                ...INIT,
                method: 'POST',
                body: JSON.stringify(body)
            })
                .then(res => this.api.handleResponse(res));
        }

    }(this);

    public skins = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async list(after?: string, size?: number, filter?: string): Promise<SkinListResponse> {
            const params = new URLSearchParams();
            if (after) {
                params.set('after', after);
            }
            if (size) {
                params.set('size', size.toString());
            }
            if (filter) {
                params.set('filter', filter);
            }
            return fetch(`${ this.api.BASE }/v2/skins?${ params.toString() }`, INIT)
                .then(res => this.api.handleResponse(res));
        }

        public async get(uuid: string): Promise<SkinResponse> {
            return fetch(`${ this.api.BASE }/v2/skins/${ uuid }`, INIT)
                .then(res => this.api.handleResponse(res));
        }

    }(this);

    private async handleResponse<T extends MineSkinResponse>(res: Response): Promise<T> {
        const json: MineSkinResponse = await res.json();
        if (json.errors?.length > 0) {
            for (let error of json.errors) {
                console.error('API error', error);
                this.nuxtApp.$notify({
                    text: error.message,
                    color: 'error'
                })
            }
        }
        if (json.warnings?.length > 0) {
            for (let warning of json.warnings) {
                console.warn('API warning', warning);
                // this.nuxtApp.$notify({
                //     text: warning.message,
                //     color: 'warning'
                // })
            }
        }
        if (json.messages?.length > 0) {
            for (let message of json.messages) {
                console.info('API message', message);
                this.nuxtApp.$notify({
                    text: message.message,
                    color: 'info'
                })
            }
        }

        return json as T;
    }

}