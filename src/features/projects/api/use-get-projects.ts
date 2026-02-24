import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";
import { ProjectsStatus } from "../types";

interface useGetProjectsProps {
    workspaceId: string;
    search?: string;
    status?: ProjectsStatus;
    assigneeId?: string;
    dueDate?: string;
    ownerId?: string;
    archived?: boolean;
}

export type AllProjectsResponseType = InferResponseType<typeof client.api.projects["$get"], 200>

export const useGetProjects = ({ workspaceId, status, ownerId, dueDate, archived, search, assigneeId }: useGetProjectsProps) => {

    const query = useQuery({
        queryKey: ["projects", JSON.stringify({ workspaceId, status, ownerId, dueDate, archived, search, assigneeId })
        ],
        queryFn: async () => {
            const response = await client.api.projects["$get"]({
                query: {
                    workspaceId,
                    status: status,
                    ownerId: ownerId,
                    dueDate: dueDate,
                    search: search
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects")
            }
            const { data } = await response.json();
            return data;
        }
    })

    return query
}

