import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["subtasks"]["$patch"], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["subtasks"]["$patch"]>


export const useEditSubTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["subtasks"]["$patch"]({ json, param })
            if (!response.ok) {
                throw new Error("Failed to create subtask")
            }
            return await response.json()
        },
        onMutate: async ({ json, param }) => {
            await queryClient.cancelQueries({ queryKey: ["sub-tasks", param.taskId] })
            const previous = queryClient.getQueryData(["sub-tasks", param.taskId])
            console.log("previous", previous)
            queryClient.setQueryData(["sub-tasks", param.taskId], (old: ResponseType["data"][]) => old ? old.map((task) => (task.id === json.id ? { ...task, isDone: json.isDone } : task)) : [])
            return { previous }
        },
        // onSuccess: ({ data }) => {
        //     queryClient.invalidateQueries({ queryKey: ["sub-tasks", data.taskId] })
        //     // queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
        //     // queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
        // },
        onError: (error, variables, context) => {
            // @ts-ignore
            if (context.previous) {
                // @ts-ignore
                queryClient.setQueryData(["sub-tasks", variables.param.taskId], context.previous
                )
            }
            toast.error("Something went wrong!")
        },
        onSettled: (data) => {
            if (data) queryClient.invalidateQueries({ queryKey: ["sub-tasks", data.data.taskId] })

        }

    })
    return mutation
}