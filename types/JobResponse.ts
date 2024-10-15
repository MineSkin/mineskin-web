import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { JobInfo } from "@mineskin/types";

export interface JobResponse extends MineSkinResponse<'job', JobInfo>{
}
