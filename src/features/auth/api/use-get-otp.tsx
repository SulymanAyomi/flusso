import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useGetOTPProps {
  email: string;
}

export const useGetOTP = ({ email }: useGetOTPProps) => {
  const query = useQuery({
    queryKey: ["otp", email],
    queryFn: async () => {
      const response = await client.api.register["request-otp"]["$get"]({
        query: { email },
      });
      const res = await response.json();
      if (!res.success) {
        throw new Error("Something went wrong");
      }
      return res.data;
    },
  });

  return query;
};
