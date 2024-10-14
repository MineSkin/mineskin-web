import type { SkinInfo2 } from "@mineskin/types";

export function skinName(skin: SkinInfo2): string {
    return skin?.name || skin?.uuid?.substring(0, 8) || 'Unknown';
}