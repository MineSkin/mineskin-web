export type RateLimitInfo = {
    limit: number;
    remaining: number;
    used: number;
    reset: number;
}