import { ref } from "vue";

export type InfiniteLoadStatus = 'ok' | 'empty' | 'error';
export type InfiniteLoadDone = (status: InfiniteLoadStatus) => void;
export type InfiniteLoader = (context: { done: InfiniteLoadDone }) => Promise<void> | void;

/**
 * Wraps the load function of a v-infinite-scroll so a failed page can be retried.
 * After an error the scroller only loads again once its end scrolls out of view and back in, which on a short or
 * empty list never happens; retry() runs the same load again and reports the result to the scroller.
 */
export function useRetryableLoad(loader: InfiniteLoader) {
    const failed = ref(false);
    const retrying = ref(false);
    let lastDone: InfiniteLoadDone | undefined;

    async function run(done: InfiniteLoadDone) {
        await loader({
            done: status => {
                failed.value = status === 'error';
                done(status);
            }
        });
    }

    async function onLoad({done}: { done: InfiniteLoadDone }) {
        lastDone = done;
        if (retrying.value) {
            // the retry is already loading this page
            done('error');
            return;
        }
        await run(done);
    }

    async function retry() {
        if (!lastDone || retrying.value) return;
        retrying.value = true;
        try {
            await run(lastDone);
        } finally {
            retrying.value = false;
        }
    }

    return {onLoad, retry, failed, retrying};
}
