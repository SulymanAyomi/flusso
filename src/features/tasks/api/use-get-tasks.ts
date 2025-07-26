import { useQuery } from "@tanstack/react-query";

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

export const useGetTasks = ({
    workspaceId,
    projectId,
    status,
    assignedToId,
    dueDate,
    search
}: useGetTasksProps) => {
    console.log("task ran", workspaceId,
        projectId,
        status,
        assignedToId,
        dueDate,
        search)

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
            console.log("task ran yess")
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