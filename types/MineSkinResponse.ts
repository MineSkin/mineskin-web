import type { CodeAndMessage } from "~/types/CodeAndMessage";

export type MineSkinResponse<K extends string, T> = {
    [key in K]: T;
} & {
    success: boolean;
    errors: CodeAndMessage[];
    warnings: CodeAndMessage[];
    messages: CodeAndMessage[];
    links: {
        [key: string]: string;
    }
};