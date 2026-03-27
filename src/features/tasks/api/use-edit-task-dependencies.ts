import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["dependencies"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["dependencies"]["$patch"]>


export const useEditTaskDependencies = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["dependencies"]["$patch"]({ json, param })
            const res = await response.json()
            if (!response.ok) {
                // @ts-ignore
                if (res?.error && res.error == 'Circular dependency detected.') {
                    throw new Error("Circular dependency detected!!")
                } else {
                    throw new Error("Failed to edit task dependencies")
                }
            }
            return res
        },
        // @ts-ignore
        onSuccess: ({ data }) => {
            console.log("success", data)
            toast.success("Task dependencies updated!!")
            // queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
            // queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            queryClient.invalidateQueries({ queryKey: ["task", data.id] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return mutation
}