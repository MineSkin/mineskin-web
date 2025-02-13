import type { JobInfo, SkinInfo2 } from "@mineskin/types";
import type { JobResponse } from "~/types/JobResponse";

export type CompletedJobRes = JobResponse & {
    skin: SkinInfo2;
}

export function isCompletedJobRes(res: JobResponse): res is CompletedJobRes {
    return res && res.job?.status === 'completed' && (res as CompletedJobRes).skin !== undefined;
}