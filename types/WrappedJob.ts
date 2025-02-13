import type { FileJson } from "~/util/file";
import type { JobInfo, JobStatus, SkinInfo2 } from "@mineskin/types";

export interface WrappedJob {
    source: JobSource;
    job: JobInfo;

    image?: string;
    skin?: SkinInfo2;

    check: JobStatusCheck;
}

export interface JobSource {
    type: string;
    content: FileJson | string;
    name: string;
}

export interface JobStatusCheck {
    last: number;
    count: number;
}