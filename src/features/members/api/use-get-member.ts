import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetMemberProjectsProps {
    memberId: string;
    workspaceId: string;
}

export type useGetMemberResponseType = InferResponseType<typeof client.api.members[":memberId"]["$get"], 200>


export const useGetMember = ({ workspaceId, memberId }: useGetMemberProjectsProps) => {
    const query = useQuery({
        queryKey: ["member", memberId],
        queryFn: async () => {
            const response = await client.api.members[":memberId"]["$get"]({ param: { memberId }, query: { workspaceId } });
            const res = await response.json()
            if (!res.success) {
                throw new Error("Failed to fetch projects")
            }
            return res.data.data;
        }
    })

    return query
}