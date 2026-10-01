import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinInfo2 } from "@mineskin/types";

export type CapeListResponse = MineSkinResponse<'capes', KnownCape[]> & {}

export type CapeSupport = 'public' | 'owner' | 'none';

export type KnownCape = {
    uuid: string;
    alias: string;
    url: string;
    hash: string;
    support?: CapeSupport;
    /** @deprecated use `support` */
    supported: boolean;
}

export type UserCapeListResponse = MineSkinResponse<'capes', UserCape[]> & {}

export type UserCape = KnownCape & {
    /** one of the user's linked accounts owns this cape */
    owned: boolean;
    /** the user can generate with this cape */
    usable: boolean;
}