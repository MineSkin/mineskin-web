export interface AuthStatus {
    authenticated: boolean;
    shouldRefreshToken: boolean;
    user?: string;
    grants?: Record<string, string | number | boolean>;
}
