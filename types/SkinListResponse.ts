import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinInfo2 } from "@mineskin/types";

export type SkinListResponse = MineSkinResponse<'skins', ListedSkin[]> & {}

export type ListedSkin = Pick<SkinInfo2, 'uuid' | 'shortId' | 'name'> & { texture?: string; [key: string]: any; };