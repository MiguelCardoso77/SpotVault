export type VisibilityStatus = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

export type SpotList = {
    listId: string;
    ownerId: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    visibilityStatus: VisibilityStatus;
    spotIds: string[];
    createdAt: Date | string;
    updatedAt: Date | string;
};
