import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.register['reset-password']["$post"]>
type RequestType = InferRequestType<typeof client.api.register["reset-password"]["$post"]>


export const useResetPassword = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.register["reset-password"]["$post"]({ json })
            const data = await response.json()
            // if (!response.ok) {
            //     if (data.error) {
            //         throw new Error(data.error)
            //     } else {
            //         throw new Error("Something went wrong")
            //     }
            // }
            return data
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("Password reset")
                queryClient.invalidateQueries({ queryKey: ["current"] })
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            } else {
                toast.error("Something went wrong")
            }
        },
        onError: async (error) => {

        }
    })
    return mutation
}