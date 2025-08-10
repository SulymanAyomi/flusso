import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["subtasks"]["$post"], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["subtasks"]["$post"]>


export const useCreateSubTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["subtasks"]["$post"]({ json, param })
            if (!response.ok) {
                throw new Error("Failed to create subtask")
            }
            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success("Subtask created")
            queryClient.invalidateQueries({ queryKey: ["sub-tasks", data.taskId] })
            // queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
            // queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
        },
        onError: () => {
            toast.error("Failed to create subtask")
        }
    })
    return mutation
}