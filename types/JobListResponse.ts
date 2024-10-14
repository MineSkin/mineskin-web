import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { JobInfo } from "@mineskin/types";

export interface JobListResponse extends MineSkinResponse<'jobs', JobInfo[]>{
}
