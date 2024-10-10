import type {Logger} from "~/types/Logger";

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();
    const empty = (message?: any, ...optionalParams: any[]): void => {
    };
    return {
        provide: {
            log: <Logger>{
                log:  console.log.bind(console) ,
                info: console.info.bind(console),
                debug: console.debug.bind(console),
                warn: console.warn.bind(console),
                err: console.error.bind(console)
            }
        }
    }
})
