import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useGetOTPProps {
  email: string;
}

export const useGetMyWorkspaces = () => {
  const query = useQuery({
    queryKey: ["all-my-workspaces"],
    queryFn: async () => {
      const response = await client.api.register["profile"]["workspaces"][
        "$get"
      ]({});
      const res = await response.json();
      if (!res.success) {
        throw new Error("Something went wrong");
      }
      return res.data;
    },
  });

  return query;
};
