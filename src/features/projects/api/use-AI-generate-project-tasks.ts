import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects.generate.tasks["$post"], 200>
type RequestType = InferRequestType<typeof client.api.projects.generate.tasks["$post"]>


export const useAIGenerateProjectTasks = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType,
        { json: RequestType; controller: AbortController }
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.projects.generate.tasks["$post"]({ json })
            return await response.json()
        },
        onError: (error) => {
            console.error(error)
        }
    })
    return mutation
}