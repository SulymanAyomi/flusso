import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"], 200>
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>


export const useDeleteMembers = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.members[":memberId"]["$delete"]({ param })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: () => {
            toast.success("Member removed successfully")
            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["members"] })
        },
        onError: (error) => {
            // toast.error("Failed to remove member")
            toast.error(error.message)
        }
    })
    return mutation
}