import type { SkinVisibility2 } from "@mineskin/types";
import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinListResponse } from "~/types/SkinListResponse";

export interface ListedCollection {
    uuid: string;
    name: string;
    visibility: SkinVisibility2;
    size: number;      // number of skins in the collection
    owned: boolean;    // true when the signed-in user owns it
    createdAt: number; // epoch ms
    updatedAt: number; // epoch ms
}

export interface CollectionLimits {
    collections: number; // max collections the user may own
    skins: number;       // max skins per collection
    private: boolean;    // may create private collections
}

export type CollectionResponse = MineSkinResponse<'collection', ListedCollection>;
export type CollectionListResponse = MineSkinResponse<'collections', ListedCollection[]> & { limits: CollectionLimits };
export type CollectionSkinListResponse = SkinListResponse & {
    pagination: { current: { after?: string }; next: { after?: string } };
};
