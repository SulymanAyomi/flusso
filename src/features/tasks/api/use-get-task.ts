import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetTaskProps {
    taskId: string;

}
export type GetTaskResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$get"], 200>

export const useGetTask = ({
    taskId
}: useGetTaskProps) => {
    const query = useQuery({
        queryKey: ["tasks",
            taskId
        ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["$get"]({
                param: {
                    taskId
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch task")
            }
            const { data } = await response.json();
            return data;
        }
    })

    return query
}
