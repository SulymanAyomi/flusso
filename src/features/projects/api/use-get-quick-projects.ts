import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"

interface useGetProjectProps {
    workspaceId: string;
}

export const useGetQuickProjects = ({ workspaceId }: useGetProjectProps) => {
    const query = useQuery({
        queryKey: ["quick-project", workspaceId],
        queryFn: async () => {
            const response = await client.api.projects["qucik-project"]["$get"]({ query: { workspaceId } });

            if (!response.ok) {
                throw new Error("Failed to fetch projects")
            }
            const { data } = await response.json();

            return data;
        }
    })

    return query
}