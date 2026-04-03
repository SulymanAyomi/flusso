import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["projects"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["projects"]["$patch"]>


export const useAssignMemberToProjects = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.members[":memberId"]["projects"]["$patch"]({ json, param })
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Member assigned to project")
                queryClient.invalidateQueries({ queryKey: ["memberprojects", data.data.memberId] })
            }
        },
        onError: (error) => {
            console.log(error)
            toast.error("Failed to assigned to project")
        }
    })
    return mutation
}