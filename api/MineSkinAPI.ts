import type { RuntimeConfig } from "nuxt/schema";
import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinResponse } from "~/types/SkinResponse";
import type { SkinListResponse } from "~/types/SkinListResponse";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import type { JobListResponse } from "~/types/JobListResponse";
import type { UserValidation } from "~/types/UserValidation";
import type { GenerateOptions } from "@mineskin/types";
import { TagVoteType } from "@mineskin/types";
import type { BasicCreditInfo } from "~/types/BasicCreditInfo";

const INIT: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'MineSkin-User-Agent': 'MineSkin-Web'
    }
}

export class MineSkinAPI {

    BASE: string = '';

    authed: boolean = false;

    constructor(readonly nuxtApp: any, readonly config: RuntimeConfig) {
        this.BASE = config.public.hosts.mineskin;
        console.debug('API base', this.BASE);
    }

    setAuthed(authed: boolean) {
        this.authed = authed;
        console.debug('API authed', this.authed);
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
            return this.api.request(`/v2/generate`, {
                headers: {},
                method: 'POST',
                body: formData
            });
        }

        public async url(url: string, options: GenerateOptions): Promise<SkinResponse> {
            const body: any = {
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
            return this.api.request(`/v2/generate`, {
                ...INIT,
                method: 'POST',
                body: JSON.stringify(body)
            });
        }

    }(this);

    public queue = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async upload(file: File, options: GenerateOptions): Promise<GenerateJobResponse> {
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
            return this.api.request(`/v2/queue`, {
                headers: {},
                method: 'POST',
                body: formData
            });
        }

        public async url(url: string, options: GenerateOptions): Promise<GenerateJobResponse> {
            const body: any = {
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
            return this.api.request(`/v2/queue`, {
                ...INIT,
                method: 'POST',
                body: JSON.stringify(body)
            });
        }

        public async user(user: string, options: GenerateOptions): Promise<GenerateJobResponse> {
            const body: any = {
                user
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
            return this.api.request(`/v2/queue`, {
                ...INIT,
                method: 'POST',
                body: JSON.stringify(body)
            });
        }

        public async list(options?: Partial<RequestOptions>): Promise<JobListResponse> {
            return this.api.request(`/v2/queue`, {
                ...INIT,
                credentials: 'include'
            }, options);
        }

        public async get(jobId: string, options?: Partial<RequestOptions>): Promise<GenerateJobResponse> {
            return this.api.request(`/v2/queue/${ jobId }?t=${ Math.round(Date.now() / 1000) }`, INIT, options);
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
            return this.api.request(`/v2/skins?${ params.toString() }`, INIT);
        }

        public async get(uuid: string): Promise<SkinResponse> {
            return this.api.request(`/v2/skins/${ uuid }`, INIT);
        }

        public async trackView(uuid: string) {
            return this.api.request(`/v2/skins/${ uuid }/interactions/views`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        public async likeSkin(uuid: string, turnstileToken: string) {
            return this.api.request(`/v2/skins/${ uuid }/interactions/views`, {
                method: 'POST',
                headers: {
                    'Turnstile-Token': turnstileToken,
                    'Content-Type': 'application/json'
                }
            })
        }

        public async voteTag(uuid: string, tag: string, vote: TagVoteType, turnstileToken: string) {
            return this.api.request(`/v2/skins/${ uuid }/tags`, {
                method: 'POST',
                headers: {
                    'Turnstile-Token': turnstileToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tag, vote})
            })
        }

        public async reportSkin(uuid: string, reason: string, turnstileToken: string) {
            return this.api.request(`/v2/skins/${ uuid }/report`, {
                method: 'POST',
                headers: {
                    'Turnstile-Token': turnstileToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({reason})
            })
        }

    }(this);

    public validate = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async name(name: string): Promise<UserValidation> {
            //TODO: update this route
            if (!name) {
                return {
                    valid: false
                };
            }
            return fetch(`${ this.api.BASE }/validate/name/${ name }`, INIT)
                .then(res => res.json());
        }

        public async uuid(uuid: string): Promise<UserValidation> {
            //TODO: update this route
            if (!uuid) {
                return {
                    valid: false
                };
            }
            return fetch(`${ this.api.BASE }/validate/uuid/${ uuid }`, INIT)
                .then(res => res.json());
        }

    }(this);

    public util = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async randomName(seed: string): Promise<string> {
            //TODO: update this route
            return fetch(`${ this.api.BASE }/random-name?seed=${ seed }`, INIT)
                .then(res => res.json())
                .then(res => res.name);
        }

    }(this);

    public me = new class {

        constructor(readonly api: MineSkinAPI) {
        }

        public async get(options?: Partial<RequestOptions>) {
            return fetch(`${ this.api.BASE }/v2/me`, {
                credentials: 'include'
            });
        }

        public async client() {
            return this.api.request(`/v2/me/client`, {
                credentials: 'include'
            }, {silent: true});
        }

        public async credits(): Promise<MineSkinResponse<"credit", BasicCreditInfo>> {
            return this.api.request(`/v2/me/credits`, {
                credentials: 'include'
            }, {silent: true});
        }

        public async apikey() {
            return this.api.request(`/v2/me/apikey`, {
                credentials: 'include'
            }, {silent: true});
        }

        public async skins(after?: string, size?: number, filter?: string): Promise<SkinListResponse> {
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
            return this.api.request(`/v2/me/skins?${ params.toString() }`, {
                ...INIT,
                credentials: 'include'
            });
        }

    }(this);

    private async request<T extends MineSkinResponse>(path: string, init: RequestInit, options?: Partial<RequestOptions>): Promise<T> {
        const baseInit = {
            ...INIT
        };
        if (this.authed) {
            baseInit.credentials = init?.credentials ?? 'include';
        }
        return fetch(`${ this.BASE }${ path }`, {
            ...baseInit,
            ...init
        })
            .then(res => this.handleResponse(res, options));
    }

    private async handleResponse<T extends MineSkinResponse>(res: Response, options?: Partial<RequestOptions>): Promise<T> {
        const json: MineSkinResponse = await res.json();
        if (json.errors?.length > 0) {
            for (let error of json.errors) {
                console.error('API error', error);
                if (options?.silent) continue;
                if (res.ok) continue; // ignore error messages if response is ok
                this.nuxtApp.$notify({
                    text: error.message,
                    color: 'error'
                })
            }
        }
        if (json.warnings?.length > 0) {
            for (let warning of json.warnings) {
                console.warn('API warning', warning);
                //if(options?.silent) continue;
                // this.nuxtApp.$notify({
                //     text: warning.message,
                //     color: 'warning'
                // })
            }
        }
        if (json.messages?.length > 0) {
            for (let message of json.messages) {
                console.info('API message', message);
                if (options?.silent) continue;
                this.nuxtApp.$notify({
                    text: message.message,
                    color: 'info'
                })
            }
        }

        return json as T;
    }

}

export interface RequestOptions {
    silent: boolean;
}