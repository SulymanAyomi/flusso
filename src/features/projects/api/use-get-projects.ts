import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";
import { ProjectsStatus } from "../types";

interface useGetProjectsProps {
    workspaceId: string;
    search?: string | null;
    status?: ProjectsStatus | null;
    assigneeId?: string | null;
    dueDate?: string | null;
    ownerId?: string | null;
    archived?: boolean | null;
}

export type AllProjectsResponseType = InferResponseType<typeof client.api.projects["$get"], 200>

export const useGetProjects = ({ workspaceId, status, ownerId, dueDate, archived, search, assigneeId }: useGetProjectsProps) => {

    const query = useQuery({
        queryKey: ["projects", JSON.stringify({ workspaceId, status, ownerId, dueDate, archived, search, assigneeId })
        ],
        queryFn: async () => {
            console.log("hello i ran", assigneeId, status, ownerId, dueDate, archived, search)
            const response = await client.api.projects["$get"]({
                query: {
                    workspaceId,
                    status: status ?? undefined,
                    ownerId: ownerId ?? undefined,
                    dueDate: dueDate ?? undefined,
                    search: search ?? undefined
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

