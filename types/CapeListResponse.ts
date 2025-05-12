import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinInfo2 } from "@mineskin/types";

export type CapeListResponse = MineSkinResponse<'capes', KnownCape[]> & {}

export type KnownCape = {
    uuid: string;
    alias: string;
    url: string;
    hash: string;
    supported: boolean;
}