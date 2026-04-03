import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetMemberProjectsProps {
    memberId: string;
    workspaceId: string;
}

export type useGetMemberProjectsResponseType = InferResponseType<typeof client.api.members[":memberId"]["projects"]["$get"], 200>


export const useGetMemberProjects = ({ workspaceId, memberId }: useGetMemberProjectsProps) => {
    const query = useQuery({
        queryKey: ["memberprojects", memberId],
        queryFn: async () => {
            const response = await client.api.members[":memberId"]["projects"]["$get"]({ param: { memberId }, query: { workspaceId } });
            const data = await response.json()
            if (!data.success) {
                throw new Error("Failed to fetch projects")
            }
            return data.data;
        }
    })

    return query
}