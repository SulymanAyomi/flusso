import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetWorkspaceProjectsProps {
    workspaceId: string;
}

export const useGetWorkspaceProjects = ({ workspaceId }: useGetWorkspaceProjectsProps) => {
    const query = useQuery({
        queryKey: ["workspace-projects", workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["recentProjects"]["$get"]({ param: { workspaceId } });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace analytics")
            }
            const { data } = await response.json();
            return data;
        }
    })

    return query
}