export interface AuthStatus {
    authenticated: boolean;
    shouldRefreshToken: boolean;
    user?: string;
    email?: string;
    picture?: string;
    grants?: Record<string, string | number | boolean>;
}
