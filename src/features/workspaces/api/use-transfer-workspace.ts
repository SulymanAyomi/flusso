import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["transfer-ownership"]["$post"], 201 | 200>
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["transfer-ownership"]["$post"]>


export const useTransferWorkspace = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.workspaces[":workspaceId"]["transfer-ownership"]["$post"]({ json, param })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Workspace ownership transfered")
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", response.data.workspaceId] })
                queryClient.invalidateQueries({ queryKey: ["members", response.data.workspaceId] })
            }
        },
        onError: (error) => {
            toast.error("Failed to transfer workspace")
        }
    })
    return mutation
}