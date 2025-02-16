import { defineNuxtPlugin, useState } from "#app";
import type { SnackbarConfig } from "~/types/SnackbarConfig";
import { useSnackbarStore } from "~/stores/snackbar";
import {storeToRefs } from "pinia";

export default defineNuxtPlugin(nuxtApp => {
    const def: SnackbarConfig = {
        color: '',
        text: '',
        multiline: false,
        timeout: 5000,
        closable: true
    }

    const config = useRuntimeConfig();
    const store = useSnackbarStore();

    const { snackbars } = storeToRefs(store)

    let timer: number | any = 0;

    return {
        provide: {
            notify: (conf: Partial<SnackbarConfig>) => {
                conf = {...def, ...conf};
                store.show(conf);
                // console.debug("notify", conf);
                // const snackbar: SnackbarConfig = conf;
                // snackbar.text = conf.text || '';
                // snackbar.color = conf.color || '';
                // snackbar.multiLine = conf.multiLine || false;
                // snackbar.timeout = conf.timeout || 5000;
                // snackbar.closable = conf.closable || true;
                //
                // store.remove(snackbar.id);

                // snackbar.show = true;
                // if (timer) clearTimeout(timer);
                // timer = setTimeout(() => snackbar.show = false, snackbar.timeout);

            }
        }
    }
})
