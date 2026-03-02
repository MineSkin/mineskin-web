window.googlefc = window.googlefc || {};
window.grantAdFreePromiseResolve = null; // called with true if the user is a subscriber, false otherwise
googlefc.controlledMessagingFunction = async (message) => {
    window.grantCheckPromise = new Promise((resolve) => {
        window.grantAdFreePromiseResolve = resolve;
    });
    const isAdFree = await window.grantCheckPromise;
    window.grantAdFreePromiseResolve = null; // reset the promise resolver for future checks
    window.grantCheckPromise = null; // reset the promise for future checks

    if (isAdFree) {
        // If the user is a subscriber, don't show any messages.
        message.proceed(false);
    } else {
        // Otherwise, show messages as usual.
        message.proceed(true);
    }
}