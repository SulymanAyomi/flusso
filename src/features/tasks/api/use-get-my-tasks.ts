import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc"
import { TaskStatus } from "../types";

interface useGetMyTasksProps {
    workspaceId: string;
    projectId?: string | null;
    search?: string | null;
    status?: TaskStatus | null;
    dueDate?: string | null;
    toDate?: string | null;
    fromDate?: string | null;
}

export type useGetTasksResponseType = InferResponseType<typeof client.api.tasks["$get"], 200>


export const useGetMyTasks = ({
    workspaceId,
    projectId,
    status,
    dueDate,
    search,
    toDate,
    fromDate
}: useGetMyTasksProps) => {

    const query = useQuery({
        queryKey: ["my-task", JSON.stringify({
            workspaceId,
            projectId,
            status,
            dueDate,
            search,
            toDate,
            fromDate
        })
        ],
        queryFn: async () => {
            const response = await client.api.tasks["my-task"]["$get"]({
                query: {
                    workspaceId,
                    projectId: projectId ?? undefined,
                    status: status ?? undefined,
                    dueDate: dueDate ?? undefined,
                    search: search ?? undefined,
                    toDate: toDate ?? undefined,
                    fromDate: fromDate ?? undefined
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