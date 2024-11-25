export interface SnackbarConfig {
    id: number;
    position: number;
    show: boolean,
    color: string,
    text: string,
    timeout: number,
    closable: boolean,
    actionLabel?: string,
    actionLink?: string
}