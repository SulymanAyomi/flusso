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
            console.log("hello front")
            const response = await client.api.register["$post"]({ json })
            return response.json()
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("User registered successfully")
                queryClient.invalidateQueries({ queryKey: ["current"] })
                queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                router.push("/")
            } else {
                toast.error("User registration failed")
            }
        },
        onError: async (error) => {
            console.log(error)
            toast.success("User registration failed")
        }
    })
    return mutation
}