import type { GenerateResponse } from "~/types/GenerateResponse";
import type { JobInfo } from "@mineskin/types";

export type GenerateJobResponse = GenerateResponse<'job', JobInfo> & {
    job: JobInfo;
}