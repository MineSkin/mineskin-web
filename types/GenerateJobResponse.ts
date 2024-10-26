import type { GenerateResponse } from "~/types/GenerateResponse";
import type { JobInfo } from "@mineskin/types";

export interface GenerateJobResponse extends GenerateResponse<'job', JobInfo>{
    job: JobInfo;
}