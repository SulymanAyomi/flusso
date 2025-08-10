import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetSubTaskProps {
    taskId: string;

}
export type GetTaskResponseSubTasksType = InferResponseType<typeof client.api.tasks[":taskId"]["comments"]["$get"], 200>

export const useGetTaskComments = ({
    taskId
}: useGetSubTaskProps) => {
    const query = useQuery({
        queryKey: ["comments",
            taskId
        ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["comments"]["$get"]({
                param: {
                    taskId
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch task comments")
            }
            const { data } = await response.json();
            return data.comments;
        }
    })

    return query
}
