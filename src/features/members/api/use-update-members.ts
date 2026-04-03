import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"], 200>
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>


export const useUpdateMembers = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.members[":memberId"]["$patch"]({ param, json })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: () => {
            toast.success("Member updated successfully")
            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["members"] })
        },
        onError: (error) => {
            toast.error("Failed to update member")
            toast.error(error.message)

        }
    })
    return mutation
}