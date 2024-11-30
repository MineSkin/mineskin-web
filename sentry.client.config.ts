import * as Sentry from "@sentry/nuxt";

const config = useRuntimeConfig();

Sentry.init({
    // If set up, you can use your runtime config here
    // dsn: useRuntimeConfig().public.sentry.dsn,
    dsn: config.public.sentryDsn,
    integrations: [Sentry.replayIntegration()],
    // Tracing
    // We recommend adjusting this value in production, or using a tracesSampler for finer control.
    tracesSampleRate: config.public.isDev ? 1.0 : 0.5,
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});