export default defineNuxtPlugin(() => {
    addRouteMiddleware('gam', () => {
        (window as any).googletag &&
        (window as any).googletag.cmd.push(() => {
            (window as any).googletag.pubads().refresh();
        });
    }, {global: true});
})