import type { MineSkinResponse } from "~/types/MineSkinResponse";
import type { SkinInfo2 } from "@mineskin/types";

export interface SkinListResponse extends MineSkinResponse<'skins', ListedSkin[]>{
}

export type ListedSkin = Pick<SkinInfo2,'uuid'|'name'> & {texture?: string};