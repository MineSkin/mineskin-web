<template>
    <div
        class="cf-turnstile"
        :id="'cf-turnstile-' + id"
    />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const model = defineModel('token');

const props = defineProps<{
    action?: string,
}>();

const config = useRuntimeConfig()

const emit = defineEmits(['error', 'timeout']);

const id = (Math.random() + 1).toString(36).substring(2);

let widget: Ref<any> = ref(null);

function turnstileCallback(token: string) {
    model.value = token;
}

function turnstileErrorCallback(error?: string) {
    console.warn(error);
    emit('error', error);
}

function turnstileTimeoutCallback(reason?: string) {
    console.warn(reason);
    emit('timeout', reason);
}

function renderTurnstile() {
    const turnstileConfig: TurnstileConfig = {
        sitekey: config.public.turnstileSiteKey,
        tabindex: props.tabindex || 0,
        callback: turnstileCallback,
        'error-callback': turnstileErrorCallback,
        'timeout-callback': turnstileTimeoutCallback,
    };
    if (props.action) {
        turnstileConfig.action = props.action;
    }
    widget.value = (window as any).turnstile.render('#cf-turnstile-' + id, turnstileConfig);
}

onMounted(() => {
    const win = window as any;

    if (!win.hasOwnProperty('turnstile') && !win.hasOwnProperty('onTurnstileLoadedCallback')) {
        win['onTurnstileLoadedCallback'] = () => {
            renderTurnstile();
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoadedCallback";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    } else {
        renderTurnstile();
    }
})

onUnmounted(() => {
    try {
        (window as any).turnstile.remove(widget.value);
    } catch (e) {
        console.warn(e);
    }
})

interface TurnstileConfig {
    sitekey: string;
    tabindex?: number;
    callback: (token: string) => void;
    'error-callback'?: (error?: string) => void;
    'timeout-callback'?: (reason?: string) => void;
    action?: string;
    cData?: string;
}

</script>