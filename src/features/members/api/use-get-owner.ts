import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc"

interface useOwnersProps {
    workspaceId: string;
    userId: string;
}

export const useOwner = ({
    workspaceId, userId
}: useOwnersProps) => {
    const query = useQuery({
        queryKey: ["owner", workspaceId, userId],
        queryFn: async () => {
            const response = await client.api.members.owner["$get"]({ query: { workspaceId, userId } });
            if (!response.ok) {
                throw new Error("Failed to fetch owner")
            }
            const { data } = await response.json();

            return data;
        },

    })

    return query
}