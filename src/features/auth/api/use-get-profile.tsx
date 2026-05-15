import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useGetOTPProps {
  email: string;
}

export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await client.api.register["profile"]["$get"]({});
      const res = await response.json();
      if (!res.success) {
        throw new Error("Something went wrong");
      }
      return res.data;
    },
  });

  return query;
};
