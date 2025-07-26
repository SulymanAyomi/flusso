import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.register['reset-request']["$post"]>
type RequestType = InferRequestType<typeof client.api.register["reset-request"]["$post"]>


export const useResetRequest = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.register["reset-request"]["$post"]({ json })
            return response.json()
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("Password request sent to mail")
                queryClient.invalidateQueries({ queryKey: ["current"] })
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            } else {
                toast.error("Email not found")
            }
        },
        onError: async (error) => {

        }
    })
    return mutation
}