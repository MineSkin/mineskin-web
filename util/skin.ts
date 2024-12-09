import type { SkinInfo2 } from "@mineskin/types";

export const PLACEHOLDER_HEAD = 'https://imagedelivery.net/3uwxrP7hx2SHdBFF5lTuXg/fdd1181f-9ebf-4930-84b3-eaae51985200/public'
export const PLACEHOLDER_BODY = 'https://imagedelivery.net/3uwxrP7hx2SHdBFF5lTuXg/3997d69c-ca2a-4f54-3d3a-da7b1073c100/public';

export function skinName(skin?: SkinInfo2, fallback: string = 'Skin'): string {
    return skin?.name || skin?.uuid?.substring(0, 8) || fallback;
}

export function addUuidDashes(uuid: string): string {
    return uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20);
}

//// https://github.com/MineSkin/mineskin.org/issues/13 by @SpraxDev
const uuidView = new DataView(new ArrayBuffer(16));

/**
 * Takes an UUID and converts it into four int32
 *
 * @param {string} uuid Valid UUID (with or without hyphens)
 *
 * @returns {number[]}
 */
export function getInt32ForUUID(uuid) {
    uuid = uuid.replace(/-/g, '');  // Remove hyphens
    const result = [];

    uuidView.setBigUint64(0, BigInt(`0x${ uuid.substring(0, 16) }`));  // most significant bits (hex)
    uuidView.setBigUint64(8, BigInt(`0x${ uuid.substring(16) }`));     // least significant bits (hex)

    // read int32
    for (let i = 0; i < 4; i++) {
        result[i] = uuidView.getInt32(i * 4, false);
    }

    return result;
}

/**
 * Takes an array with four int32 and return a string representation
 * that can be used for Minecraft 1.16+ commands (nbt)
 *
 * @param {number[]} uuidInt32
 *
 * @returns {string}
 */
export function formatInt32UUID(uuidInt32) {
    return `[I;${ uuidInt32[0] },${ uuidInt32[1] },${ uuidInt32[2] },${ uuidInt32[3] }]`;
}
