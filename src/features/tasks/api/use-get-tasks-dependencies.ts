import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc"
import { TaskStatus } from "../types";

interface useGetTaskDependenciesProps {
    taskId: string;
}

export type useGetTasksResponseType = InferResponseType<typeof client.api.tasks["$get"], 200>


export const useGetTaskDependencies = ({
    taskId
}: useGetTaskDependenciesProps) => {

    const query = useQuery({
        queryKey: ["task-dependencies", JSON.stringify({
            taskId
        })
        ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["dependencies"]["$get"]({
                param: {
                    taskId
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