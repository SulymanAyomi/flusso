import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"], 201 | 200>
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>


export const useCreateWorkspace = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form }) => {
            const response = await client.api.workspaces["$post"]({ form })
            const data = await response.json()
            if (!response.ok || !data.success) {
                throw new Error("Failed to create workspace")
            }
            return data
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Workspace created")
                router.push(`/workspaces/${response.data.id}`);
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            }
        },
        onError: (error) => {
            if (error.message == "Unauthorized") {
                router.push(`/sign-in`);
                return;
            }
            toast.error("Failed to create workspace")
        }
    })
    return mutation
}