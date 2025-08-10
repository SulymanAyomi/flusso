import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetTaskProps {
    taskId: string;

}
export type GetTaskResponseActivitiesType = InferResponseType<typeof client.api.tasks[":taskId"]["activities"]["$get"], 200>

export const useGetTaskactivities = ({
    taskId
}: useGetTaskProps) => {
    const query = useQuery({
        queryKey: ["task-activities",
            taskId
        ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["activities"]["$get"]({
                param: {
                    taskId
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch task activies")
            }
            const { data } = await response.json();
            return data.activities;
        }
    })

    return query
}
