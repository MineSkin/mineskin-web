import type { SkinInfo2 } from "@mineskin/types";

export const PLACEHOLDER_HEAD = 'https://imagedelivery.net/3uwxrP7hx2SHdBFF5lTuXg/3f567030-3a96-48a6-fcaa-71b92e0df600/public'
export const PLACEHOLDER_BODY = 'https://imagedelivery.net/3uwxrP7hx2SHdBFF5lTuXg/6aebf9dd-5732-461f-6deb-c88e226cde00/public';
//TODO: make a nicer placeholder skin

export function skinName(skin?: SkinInfo2): string {
    return skin?.name || skin?.uuid?.substring(0, 8) || 'Skin';
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
