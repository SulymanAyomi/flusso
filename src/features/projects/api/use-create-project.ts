import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects["$post"]>
type RequestType = InferRequestType<typeof client.api.projects["$post"]>


export const useCreateProject = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.projects["$post"]({ json })
            const data = await response.json()
            if (!response.ok) {
                // @ts-ignore
                throw new Error(data.error)
            }
            console.log(data)
            return data
        },
        onSuccess: (data) => {
            toast.success("Project created")
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["projects", data.data.workspaceId] })
            queryClient.invalidateQueries({ queryKey: ["workspace-activities", data.data.workspaceId] })
        },
        onError: (error) => {
            console.log(error)
            toast.error("Failed to create project")
        }
    })
    return mutation
}