export interface SkinUser {
    isOwner: boolean;
    hasGenerated: boolean;
    canEdit: boolean;
    editReason?: string;
}