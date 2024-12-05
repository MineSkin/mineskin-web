import { defineNuxtPlugin } from "#app";
import * as Sentry from "@sentry/browser"

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();
    return {
        provide: {
            initSentry: (...args: any[]) => {
                Sentry.init({
                    dsn: config.public.sentryDsn,
                    integrations: [
                        Sentry.browserTracingIntegration(),
                        Sentry.replayIntegration(),
                    ],
                    // Tracing
                    tracesSampleRate: config.public.isDev ? 1.0 : 0.5,
                    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
                    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
                    // Session Replay
                    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
                    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
                });
            }
        }
    }
})
