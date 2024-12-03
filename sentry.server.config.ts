import * as Sentry from "@sentry/nuxt";

const config = useRuntimeConfig();

Sentry.init({
    dsn: config.public.sentryDsn,
    // Tracing
    // We recommend adjusting this value in production, or using a tracesSampler for finer control.
    tracesSampleRate: config.public.isDev ? 1.0 : 0.5
});