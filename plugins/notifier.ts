import { defineNuxtPlugin } from "#app";
import type { SnackbarConfig } from "~/types/SnackbarConfig";

export default defineNuxtPlugin(nuxtApp => {
    const conf: SnackbarConfig = {
        show: false,
        color: '',
        text: '',
        timeout: -1,
        closable: true
    }
    const snackbar = useState<SnackbarConfig>('snackbar', () => conf)

    let timer: number | any = 0;

    return {
        provide: {
            notify: (conf: Partial<SnackbarConfig>) => {
                console.debug("notify", conf);
                snackbar.value.text = conf.text || '';
                snackbar.value.color = conf.color || '';
                snackbar.value.timeout = conf.timeout || 5000;
                snackbar.value.closable = conf.closable || true;

                snackbar.value.show = true;
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => snackbar.value.show = false, snackbar.value.timeout);
            }
        }
    }
})
