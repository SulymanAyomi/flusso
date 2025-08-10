import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetSubTaskProps {
    taskId: string;

}
export type GetTaskResponseSubTasksType = InferResponseType<typeof client.api.tasks[":taskId"]["subtasks"]["$get"], 200>

export const useGetSubTasks = ({
    taskId
}: useGetSubTaskProps) => {
    const query = useQuery({
        queryKey: ["sub-tasks",
            taskId
        ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["subtasks"]["$get"]({
                param: {
                    taskId
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch task activies")
            }
            const { data } = await response.json();
            return data.subTask;
        }
    })

    return query
}
