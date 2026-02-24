import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono";

interface useGetProjectAnalyticsProps {
    workspaceId: string;
}

export const useGetProjectAnalytics = ({ workspaceId }: useGetProjectAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["project-analytics", workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["projects"]["analytics"]["$get"]({ param: { workspaceId } });

            if (!response.ok) {
                throw new Error("Failed to fetch projects analytics")
            }
            const { data } = await response.json();
            return data;
        }
    })

    return query
}