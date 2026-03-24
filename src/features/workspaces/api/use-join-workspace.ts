import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>


export const useJoinWorkspace = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param, json })
            const data = await response.json()
            if (!data.success) {
                // @ts-ignore
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: ({ data }) => {
            toast.success("Workspace joined successfully")
            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", data.id] })
        },
        onError: () => {
            toast.error("Failed to join workspace")
        }
    })
    return mutation
}