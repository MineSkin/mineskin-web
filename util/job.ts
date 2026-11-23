import type { WrappedJob } from "~/types/WrappedJob";

/**
 * Human-readable name of what a job was generated from (file name, url basename or user),
 * without extension and limited in length. Undefined if the source isn't known,
 * e.g. for jobs that weren't submitted from this browser.
 */
export function jobSourceName(job?: WrappedJob): string | undefined {
    const source = job?.source;
    if (!source?.name || source.type === 'unknown') return undefined;
    let name = source.name;
    if (source.type === 'url') {
        // url basename, without query/hash
        name = name.split(/[?#]/)[0].split('/').filter(part => !!part).pop() || '';
    }
    // remove extension
    name = name.split('.')[0];
    // limit length
    name = name.substring(0, 32);
    return name || undefined;
}
