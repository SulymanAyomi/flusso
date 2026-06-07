export type WorkspaceType = {
    name: string;
    id: string;
    imageUrl: string | null;
    imageUrlPublicId: string | null;
    inviteCode: string;
    ownerId: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    _count: {
        members: number;
        projects: number;
    }
}
export type WorkspacesType = {
    name: string;
    id: string;
    imageUrl: string | null;
    imageUrlPublicId: string | null;
    inviteCode: string;
    ownerId: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}

