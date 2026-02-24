import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"

interface useGetWorkspaceAnalyticsProps {
    workspaceId: string;
}

export const useGetWorkspaceTasksAnalytics = ({ workspaceId }: useGetWorkspaceAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["task-analytics", workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["analytics"]["my-tasks"]["$get"]({ param: { workspaceId } });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace analytics")
            }
            const { data } = await response.json();
            return data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutes (matches server cache)
        refetchOnWindowFocus: false,
    })

    return query
}