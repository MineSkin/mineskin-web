// Cookie consent banner (self-hosted cookie-script-diy, public/js/cookie-consent.min.js).
// nuxt.config.ts renders the library and its init into the SSR <head> (see cookieConsentHead below),
// so Consent Mode defaults are set before any Google tag loads.
// Where GDPR applies, Google's own consent message (AdSense "Privacy & messaging") is the only popup and the
// library takes the choice from it through the IAB TCF API; elsewhere the library shows its own banner.

type CookieInfo = { name: string, provider: string, duration: string, description: string };

const strictCookies: CookieInfo[] = [
    {name: 'CookieScriptConsent', provider: 'MineSkin', duration: '1 year', description: 'Stores your cookie choice.'},
    {name: 'mskacc', provider: 'MineSkin', duration: '1 hour', description: 'Keeps you signed in to your MineSkin account.'},
    {name: 'mskacc_gauth', provider: 'MineSkin', duration: '15 minutes', description: 'Used while you sign in with Google.'},
    {name: 'mskapi', provider: 'MineSkin', duration: '1 hour', description: 'Authenticates your requests to the MineSkin API.'},
    {name: 'mskweb', provider: 'MineSkin', duration: '1 hour', description: 'Lets this site show your account and plan.'},
    {name: '__cf_bm', provider: 'Cloudflare', duration: '30 minutes', description: 'Protects the site against bots.'},
];

const functionalityCookies: CookieInfo[] = [
    {name: 'i18n_redirected', provider: 'MineSkin', duration: '1 year', description: 'Remembers your language.'},
];

const performanceCookies: CookieInfo[] = [
    {name: '_ga', provider: 'Google Analytics', duration: '2 years', description: 'Distinguishes visitors for usage statistics.'},
    {name: '_ga_*', provider: 'Google Analytics', duration: '2 years', description: 'Keeps the session state for usage statistics.'},
];

const targetingCookies: CookieInfo[] = [
    {name: '__eoi', provider: 'Google', duration: '6 months', description: 'Used by Google ads to prevent fraud.'},
];

// en and de are built into the library; these are merged over en.
const translations = {
    es: {
        title: 'Usamos cookies',
        description: 'Usamos cookies para que este sitio funcione, para medir cómo se usa y, con tu permiso, para mostrarte contenido relevante. Puedes cambiar tu elección en cualquier momento.',
        acceptAll: 'Aceptar todo',
        rejectAll: 'Rechazar todo',
        settings: 'Configuración',
        save: 'Guardar preferencias',
        close: 'Cerrar',
        alwaysActive: 'Siempre activas',
        privacyPolicy: 'Política de privacidad',
        cookiePolicy: 'Política de cookies',
        settingsTitle: 'Configuración de cookies',
        settingsDescription: 'Elige qué categorías de cookies permites. Las cookies estrictamente necesarias siempre están activas porque el sitio no funciona sin ellas.',
        manage: 'Configuración de cookies',
        blockedContent: 'Este contenido está bloqueado hasta que aceptes las cookies de {category}.',
        blockedAccept: 'Aceptar y cargar',
        cookieName: 'Nombre',
        cookieProvider: 'Proveedor',
        cookieDuration: 'Duración',
        cookieDescription: 'Descripción',
        categories: {
            strict: {
                title: 'Estrictamente necesarias',
                description: 'Necesarias para que el sitio funcione, por ejemplo para recordar tu elección de cookies o mantener tu sesión iniciada.'
            },
            functionality: {
                title: 'Funcionalidad',
                description: 'Recuerdan lo que eliges (como el idioma) y ofrecen funciones mejoradas y más personales.'
            },
            performance: {
                title: 'Rendimiento',
                description: 'Nos ayudan a entender cómo se usa el sitio mediante estadísticas de uso anónimas.'
            },
            targeting: {
                title: 'Marketing',
                description: 'Se usan para mostrarte publicidad relevante y medir la eficacia de las campañas.'
            },
            unclassified: {
                title: 'Sin clasificar',
                description: 'Cookies que todavía estamos clasificando junto con sus proveedores.'
            }
        }
    },
    fr: {
        title: 'Nous utilisons des cookies',
        description: 'Nous utilisons des cookies pour faire fonctionner ce site, mesurer son utilisation et, avec votre accord, vous montrer des contenus pertinents. Vous pouvez modifier votre choix à tout moment.',
        acceptAll: 'Tout accepter',
        rejectAll: 'Tout refuser',
        settings: 'Paramètres',
        save: 'Enregistrer mes choix',
        close: 'Fermer',
        alwaysActive: 'Toujours actifs',
        privacyPolicy: 'Politique de confidentialité',
        cookiePolicy: 'Politique relative aux cookies',
        settingsTitle: 'Paramètres des cookies',
        settingsDescription: 'Choisissez les catégories de cookies que vous autorisez. Les cookies strictement nécessaires sont toujours actifs, car le site ne fonctionne pas sans eux.',
        manage: 'Paramètres des cookies',
        blockedContent: 'Ce contenu est bloqué tant que vous n’acceptez pas les cookies « {category} ».',
        blockedAccept: 'Accepter et charger',
        cookieName: 'Nom',
        cookieProvider: 'Fournisseur',
        cookieDuration: 'Durée',
        cookieDescription: 'Description',
        categories: {
            strict: {
                title: 'Strictement nécessaires',
                description: 'Indispensables au fonctionnement du site, par exemple pour mémoriser votre choix de cookies ou vous garder connecté.'
            },
            functionality: {
                title: 'Fonctionnalité',
                description: 'Mémorisent vos choix (comme la langue) et offrent des fonctions améliorées et plus personnelles.'
            },
            performance: {
                title: 'Performance',
                description: 'Nous aident à comprendre comment le site est utilisé grâce à des statistiques d’utilisation anonymes.'
            },
            targeting: {
                title: 'Marketing',
                description: 'Servent à afficher des publicités pertinentes pour vous et à mesurer l’efficacité des campagnes.'
            },
            unclassified: {
                title: 'Non classés',
                description: 'Cookies que nous sommes encore en train de classer avec leurs fournisseurs.'
            }
        }
    },
    hi: {
        title: 'हम कुकीज़ का उपयोग करते हैं',
        description: 'हम इस साइट को चलाने, इसके उपयोग को मापने और आपकी अनुमति से आपको प्रासंगिक सामग्री दिखाने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी पसंद कभी भी बदल सकते हैं।',
        acceptAll: 'सभी स्वीकार करें',
        rejectAll: 'सभी अस्वीकार करें',
        settings: 'सेटिंग्स',
        save: 'पसंद सहेजें',
        close: 'बंद करें',
        alwaysActive: 'हमेशा सक्रिय',
        privacyPolicy: 'गोपनीयता नीति',
        cookiePolicy: 'कुकी नीति',
        settingsTitle: 'कुकी सेटिंग्स',
        settingsDescription: 'चुनें कि आप किन श्रेणियों की कुकीज़ की अनुमति देते हैं। ज़रूरी कुकीज़ हमेशा चालू रहती हैं, क्योंकि उनके बिना साइट काम नहीं करती।',
        manage: 'कुकी सेटिंग्स',
        blockedContent: 'यह सामग्री तब तक ब्लॉक है, जब तक आप {category} कुकीज़ स्वीकार नहीं करते।',
        blockedAccept: 'स्वीकार करें और लोड करें',
        cookieName: 'नाम',
        cookieProvider: 'प्रदाता',
        cookieDuration: 'अवधि',
        cookieDescription: 'विवरण',
        categories: {
            strict: {
                title: 'पूरी तरह आवश्यक',
                description: 'साइट के काम करने के लिए ज़रूरी, जैसे आपकी कुकी पसंद याद रखना या आपको लॉग इन रखना।'
            },
            functionality: {
                title: 'कार्यक्षमता',
                description: 'आपकी चुनी गई पसंद (जैसे भाषा) याद रखती हैं और बेहतर, ज़्यादा व्यक्तिगत सुविधाएँ देती हैं।'
            },
            performance: {
                title: 'प्रदर्शन',
                description: 'गुमनाम उपयोग आँकड़ों से हमें यह समझने में मदद करती हैं कि साइट का उपयोग कैसे होता है।'
            },
            targeting: {
                title: 'मार्केटिंग',
                description: 'आपके लिए प्रासंगिक विज्ञापन दिखाने और अभियानों का असर मापने के लिए उपयोग होती हैं।'
            },
            unclassified: {
                title: 'अवर्गीकृत',
                description: 'वे कुकीज़ जिन्हें हम अभी उनके प्रदाताओं के साथ वर्गीकृत कर रहे हैं।'
            }
        }
    },
    id: {
        title: 'Kami menggunakan cookie',
        description: 'Kami menggunakan cookie agar situs ini berfungsi, untuk mengukur cara situs digunakan, dan dengan izin Anda, untuk menampilkan konten yang relevan. Anda dapat mengubah pilihan Anda kapan saja.',
        acceptAll: 'Terima semua',
        rejectAll: 'Tolak semua',
        settings: 'Pengaturan',
        save: 'Simpan pilihan',
        close: 'Tutup',
        alwaysActive: 'Selalu aktif',
        privacyPolicy: 'Kebijakan privasi',
        cookiePolicy: 'Kebijakan cookie',
        settingsTitle: 'Pengaturan cookie',
        settingsDescription: 'Pilih kategori cookie yang Anda izinkan. Cookie yang benar-benar diperlukan selalu aktif karena situs tidak berfungsi tanpanya.',
        manage: 'Pengaturan cookie',
        blockedContent: 'Konten ini diblokir sampai Anda menerima cookie {category}.',
        blockedAccept: 'Terima dan muat',
        cookieName: 'Nama',
        cookieProvider: 'Penyedia',
        cookieDuration: 'Durasi',
        cookieDescription: 'Deskripsi',
        categories: {
            strict: {
                title: 'Benar-benar diperlukan',
                description: 'Diperlukan agar situs berfungsi, misalnya untuk mengingat pilihan cookie Anda atau membuat Anda tetap masuk.'
            },
            functionality: {
                title: 'Fungsionalitas',
                description: 'Mengingat pilihan Anda (seperti bahasa) dan menyediakan fitur yang lebih baik dan lebih personal.'
            },
            performance: {
                title: 'Performa',
                description: 'Membantu kami memahami cara pengunjung menggunakan situs dengan statistik penggunaan anonim.'
            },
            targeting: {
                title: 'Pemasaran',
                description: 'Digunakan untuk menampilkan iklan yang relevan bagi Anda dan mengukur efektivitas kampanye.'
            },
            unclassified: {
                title: 'Tidak terklasifikasi',
                description: 'Cookie yang masih kami klasifikasikan bersama penyedianya.'
            }
        }
    }
};

export const cookieConsentConfig = {
    links: {
        privacy: 'https://legal.inventivetalent.org/privacy/mineskin'
    },
    categories: {
        strict: {required: true, cookies: strictCookies},
        functionality: {cookies: functionalityCookies},
        performance: {cookies: performanceCookies},
        targeting: {cookies: targetingCookies}
    },
    tcf: {enabled: true},
    ui: {theme: 'dark'},
    translations
};

// Banner languages besides en. Other site locales (ru, pl, pt) get the English banner.
const bannerLocales = ['de', ...Object.keys(translations)];

// The banner follows the site locale from the URL prefix (i18n strategy prefix_and_default; no prefix = en).
// The guard keeps a second execution of this script from initializing the library again.
const initScript = `(function(){
var c=${ JSON.stringify(cookieConsentConfig).replace(/</g, '\\u003c') };
var m=location.pathname.match(/^\\/(${ bannerLocales.join('|') })(?=\\/|$)/);
c.language=m?m[1]:'en';
if(window.CookieConsent&&!window.__mskCookieConsent){window.__mskCookieConsent=true;window.CookieConsent.init(c);}
})();`;

// Match the Vuetify 'mineskin' dark theme (surface #212121, primary #4EA5D9, on-primary #fff).
// The library's theme values sit on #ccd-root, so the override uses the same ID selector.
const themeStyle = '#ccd-root{--ccd-bg:#212121;--ccd-fg:#fff;--ccd-border:#424242;--ccd-primary:#4EA5D9;--ccd-primary-fg:#fff;--ccd-toggle:#4EA5D9;--ccd-font:Roboto,sans-serif}';

// Rendered in the SSR <head> by nuxt.config.ts (app.head). Both scripts must stay normal blocking scripts
// (no async/defer) that run before any Google tag.
export const cookieConsentHead = {
    script: [
        {src: '/js/cookie-consent.min.js'},
        {innerHTML: initScript}
    ],
    style: [
        {innerHTML: themeStyle}
    ]
};
