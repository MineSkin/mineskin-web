import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { JobInfo } from "@mineskin/types";

export type JobResponse = MineSkinResponse<'job', JobInfo> & {
    job: JobInfo;
}
