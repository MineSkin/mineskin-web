import type { RuntimeConfig } from "nuxt/schema";
import type { GenerateOptions } from "~/types/GenerateOptions";

const INIT: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

export class MineSkinAPI{

    BASE: string = '';

    constructor(readonly nuxtApp: any, readonly config: RuntimeConfig) {
        this.BASE = config.public.hosts.mineskin;
        console.debug('API base', this.BASE)
    }

    public generate = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async upload(file: File, options: GenerateOptions): Promise<any> {
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
            return fetch(`${this.api.BASE}/v2/generate`, {
                ...INIT,
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: formData
            });
        }

        public async url(url: string, options: GenerateOptions): Promise<any> {
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
            return fetch(`${this.api.BASE}/v2/generate`, {
                ...INIT,
                method: 'POST',
                body: JSON.stringify(body)
            });
        }

    }(this);

    public skins = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async list(after?: string, size?: number, filter?: string): Promise<any> {
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
                .then(res => res.json()); //TODO: wrap this in error handler, etc.
        }

        public async get(uuid: string): Promise<any> {
            return fetch(`${ this.api.BASE }/v2/skins/${ uuid }`, INIT)
                .then(res => res.json());
        }

    }(this);

}