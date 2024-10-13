import { defineNuxtPlugin, useState } from "#app";
import type { SnackbarConfig } from "~/types/SnackbarConfig";

export default defineNuxtPlugin(nuxtApp => {
    const conf: SnackbarConfig = {
        color: '',
        text: '',
        timeout: -1,
        closable: true
    }
    const queue = useState<Array<SnackbarConfig>>('snackbars', () => ([]));

    let timer: number | any = 0;

    return {
        provide: {
            notify: (conf: Partial<SnackbarConfig>) => {
                console.debug("notify", conf);
                const snackbar: SnackbarConfig = conf;
                snackbar.text = conf.text || '';
                snackbar.color = conf.color || '';
                snackbar.timeout = conf.timeout || 5000;
                snackbar.closable = conf.closable || true;

                queue.value.push(snackbar);

                // snackbar.show = true;
                // if (timer) clearTimeout(timer);
                // timer = setTimeout(() => snackbar.show = false, snackbar.timeout);

                console.log(queue.value)
            }
        }
    }
})
