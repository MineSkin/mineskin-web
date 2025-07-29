import type { FileJson } from "~/util/file";
import { GenerateType } from "@mineskin/types";

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const processNameVariables = (original: string, generateType: GenerateType, index: number, url: string | null, file: File | FileJson | null, user: string | null) => {
    let replaced = original;

    replaced = replaced.replace(/{index}/g, index.toString());

    if (generateType === GenerateType.USER && user) {
        replaced = replaced.replace(/{user}/g, user);
    }
    if (generateType === GenerateType.UPLOAD && file) {
        replaced = replaced.replace(/{file}/g, file.name.replace('.png', ''));
    }
    if (generateType === GenerateType.URL && url) {
        const parsed = new URL(url);
        const filename = parsed.pathname.split('/').pop();
        if (filename) {
            replaced = replaced.replace(/{file}/g, filename.replace('.png', ''));
        }
    }

    return replaced;
}