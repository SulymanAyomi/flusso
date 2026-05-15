import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.register["profile"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.register["profile"]["$patch"]>


export const useChangeProfile = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.register["profile"]["$patch"]({ json })
            return response.json()
        },
        onSuccess: async (data) => {
            if (data.success) {
                router.refresh()
                toast.success("Profile updated successfully")
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            }
        },
        onError: async (error) => {
            toast.error("Failed to update profile")
        }
    })
    return mutation
}