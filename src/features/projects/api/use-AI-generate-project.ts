import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { ErrorResponse, ProjectError, ValidatePromptRequest } from "../types";

type ResponseType = InferResponseType<typeof client.api.projects.generate.project["$post"], 200>
type RequestType = ValidatePromptRequest


export const useGenerateProject = () => {

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType,
        { json: RequestType; controller: AbortController }
    >({
        mutationFn: async ({ json }) => {
            try {
                // if (typeof window !== 'undefined' && !navigator.onLine) {
                //     throw new ProjectError(
                //         'BROWSER_OFFLINE',
                //         'You appear to be offline.',
                //         true
                //     );
                // }
                const response = await client.api.projects.generate.project["$post"]({ json })
                const data = await response.json()

                if (!response.ok) {
                    const errorData = data as ErrorResponse
                    throw new ProjectError(
                        errorData.error.type,
                        errorData.error.message,
                        errorData.error.retryable,
                        errorData.error.metadata
                    )
                }
                return data
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new ProjectError(
                        'VALIDATION_NETWORK_ERROR',
                        'Connection lost. Please check your internet connection.',
                        true
                    )
                }
                if (error instanceof ProjectError) {
                    throw error
                }
                throw new ProjectError(
                    'SERVER_ERROR',
                    'An unexpected error occured.',
                    true
                )
            }

        },
        retry: (failureCount, error: any) => {
            if (!error.retryable) return false;
            if (error.type === 'VALIDATION_NETWORK_ERROR') {
                return failureCount < 2
            };
            if (error.type === 'VALIDATION_AI_TIMEOUT') {
                return failureCount < 1
            };
            return false
        },
        retryDelay: (attemptIndex) => {
            return Math.min(100 * 2 ** attemptIndex, 5000)
        }
    })
    return mutation
}