import type { CodeAndMessage } from "~/types/CodeAndMessage";
import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { RateLimitInfo, SkinInfo2 } from "@mineskin/types";

export interface GenerateResponse<K extends string, T> extends MineSkinResponse<K,T> {
    rateLimit?: RateLimitInfo;
    usage?: UsageInfo;
}