import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc"
import { TaskStatus } from "../types";

interface useGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    search?: string | null;
    status?: TaskStatus | null;
    assignedToId?: string | null;
    dueDate?: string | null;
}

export type useGetTasksResponseType = InferResponseType<typeof client.api.tasks["$get"], 200>


export const useGetTasks = ({
    workspaceId,
    projectId,
    status,
    assignedToId,
    dueDate,
    search
}: useGetTasksProps) => {

    const query = useQuery({
        queryKey: ["tasks", JSON.stringify({
            workspaceId,
            projectId,
            status,
            assignedToId,
            dueDate,
            search
        })
        ],
        queryFn: async () => {
            const response = await client.api.tasks["$get"]({
                query: {
                    workspaceId,
                    projectId: projectId ?? undefined,
                    status: status ?? undefined,
                    assignedToId: assignedToId ?? undefined,
                    dueDate: dueDate ?? undefined,
                    search: search ?? undefined
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tasks")
            }
            const { data } = await response.json();
            return data;
        }
    })

    return query
}