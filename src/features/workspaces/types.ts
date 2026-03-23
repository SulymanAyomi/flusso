// import { Models } from "node-appwrite";


export type WorkspaceType = {
    name: string;
    id: string;
    imageUrl: string;
    inviteCode: string;
    ownerId: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}
