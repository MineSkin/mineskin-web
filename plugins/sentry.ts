import { defineNuxtPlugin } from "#app";
import * as Sentry from "@sentry/browser"

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();
    return {
        provide: {
            initSentry: (...args: any[]) => {
                Sentry.init({
                    dsn: config.public.sentryDsn,
                    environment: config.public.isDev ? 'development' : 'production',
                    release: config.public.cfPagesBranch + '-' + config.public.cfPagesCommitSha?.substring(0, 7),
                    integrations: [
                        Sentry.browserTracingIntegration(),
                        Sentry.replayIntegration(),
                        Sentry.feedbackIntegration({
                            // Additional SDK configuration goes in here, for example:
                            colorScheme: "system",
                        }),
                    ],
                    // Tracing
                    tracesSampleRate: config.public.isDev ? 1.0 : 0.2,
                    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
                    tracePropagationTargets: ["localhost", "https://api.mineskin.org", "https://account-api.mineskin.org"],
                    ignoreErrors: [
                        "TagError: adsbygoogle",
                        "TurnstileError"
                    ],
                    // Session Replay
                    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
                    replaysOnErrorSampleRate: 0.2, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
                });
            }
        }
    }
})
