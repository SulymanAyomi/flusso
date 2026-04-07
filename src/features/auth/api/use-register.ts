import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.register["$post"]>
type RequestType = InferRequestType<typeof client.api.register["$post"]>


export const useRegister = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.register["$post"]({ json })
            const data = await response.json()
            if (!response.ok) {
                // if (response.status == 500) {
                //     throw new Error("")
                // }
                // @ts-ignore
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("User registration successful")
                queryClient.invalidateQueries({ queryKey: ["current"] })
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                router.push(`/verification?email=${data.data.email}&&vid=${data.data.vid}`)
            }
        },
        onError: async (error) => {
            toast.error("User registration failed")
        }
    })
    return mutation
}