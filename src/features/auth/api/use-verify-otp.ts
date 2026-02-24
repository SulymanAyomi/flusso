import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.register["verify-otp"]["$post"]>
type RequestType = InferRequestType<typeof client.api.register["verify-otp"]["$post"]>


export const useVerifyOtp = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.register["verify-otp"]["$post"]({ json })
            const data = await response.json()
            if (!response.ok) {
                if (response.status == 500) {
                    throw new Error("Code invalid or expired")
                }
                // @ts-ignore
                throw new Error(data.error)
            }

            return data
        },

    })
    return mutation
}