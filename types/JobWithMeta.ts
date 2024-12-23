import type { JobInfo } from "@mineskin/types";

export interface JobWithMeta extends JobInfo {
    lastStatusCheck: number;
    statusCheckCount: number;
    originalName?: string;
}