import { en, de, fr, es, pl, ru, id } from "vuetify/locale";
import type { I18nOptions } from "vue-i18n";

export default {
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'en',
    messages: {
        en: {$vuetify: en},
        de: {$vuetify: de},
        fr: {$vuetify: fr},
        es: {$vuetify: es},
        pl: {$vuetify: pl},
        ru: {$vuetify: ru},
        id: {$vuetify: id},
    },
} satisfies Partial<I18nOptions>;