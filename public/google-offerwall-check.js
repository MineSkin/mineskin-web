window.googlefc = window.googlefc || {};
// While googlefc.controlledMessagingFunction is defined, Google's Privacy & messaging shows no message at all
// (the European regulations consent message included) until message.proceed() is called.
// The app reports the ad-free state once it knows it: it stores it in window.grantAdFreeResult and calls
// window.grantAdFreePromiseResolve(isAdFree) if a message is already waiting.
window.grantAdFreePromiseResolve = null; // called with true if the user is a subscriber, false otherwise
googlefc.controlledMessagingFunction = async (message) => {
    let isAdFree = window.grantAdFreeResult;
    if (typeof isAdFree !== 'boolean') {
        window.grantCheckPromise = new Promise((resolve) => {
            window.grantAdFreePromiseResolve = resolve;
            // don't hold Google's messages forever if the check never answers
            setTimeout(() => resolve(false), 5000);
        });
        isAdFree = await window.grantCheckPromise;
        window.grantAdFreePromiseResolve = null; // reset the promise resolver for future checks
        window.grantCheckPromise = null; // reset the promise for future checks
    }

    if (isAdFree) {
        // If the user is a subscriber, don't show any messages.
        message.proceed(false);
    } else {
        // Otherwise, show messages as usual.
        message.proceed(true);
    }
}
