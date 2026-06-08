import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>


export const useEditTask = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: ({ data, }) => {
            toast.success("Task updated successfully")
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            queryClient.invalidateQueries({ queryKey: ["my-task"] })
            queryClient.invalidateQueries({ queryKey: ["task", data] })
        },
        onError: ({ message }) => {
            toast.error(message)
        }
    })
    return mutation
}