import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>
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
            return await response.json()
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Workspace created")
                router.push(`/workspaces/${data.data.id}`);
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            } else {
                toast.error("Failed to create workspace")
            }

        },
        onError: (error) => {
            if (error.message == "Unauthourize") {
                router.push(`/sign-in`);
            }
            toast.error("Failed to create workspace")
        }
    })
    return mutation
}