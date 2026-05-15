import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["leave"]["$post"], 201 | 200>
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["leave"]["$post"]>


export const useLeaveWorkspace = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[":workspaceId"]["leave"]["$post"]({ param })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("You left workspace")
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", response.data.workspaceId] })
                queryClient.invalidateQueries({ queryKey: ["members", response.data.workspaceId] })
                queryClient.invalidateQueries({ queryKey: ["projects", response.data.workspaceId] })
            }
        },
        onError: (error) => {
            toast.error("Failed to leave workspace")
        }
    })
    return mutation
}