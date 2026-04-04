import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetCurrentMemberProps {
    workspaceId: string;
}



export const useGetCurrentMember = ({ workspaceId }: useGetCurrentMemberProps) => {
    const query = useQuery({
        queryKey: ["current-member", workspaceId],
        queryFn: async () => {
            const response = await client.api.members["current-member"]["$get"]({ query: { workspaceId } });
            const res = await response.json()
            if (!res.success) {
                throw new Error("Failed to fetch projects")
            }
            return res.data;
        }
    })

    return query
}