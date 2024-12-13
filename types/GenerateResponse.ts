import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { RateLimitInfo, SkinInfo2, UsageInfo } from "@mineskin/types";

export type GenerateResponse<K extends string, T> = MineSkinResponse<K, T> & {
    rateLimit?: RateLimitInfo;
    usage?: UsageInfo;
}