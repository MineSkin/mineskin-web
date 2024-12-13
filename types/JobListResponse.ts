import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { JobInfo } from "@mineskin/types";

export type JobListResponse = MineSkinResponse<'jobs', JobInfo[]> & {}
