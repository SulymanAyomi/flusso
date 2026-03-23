'use client';

import { useCallback, useState } from 'react';
import { useValidatePrompt } from '../../api/use-validate-prompt';
import { useGenerateProject } from '../../api/use-AI-generate-project';
import { ChatMessage, ErrorAction, ErrorType, ProjectData, ProjectError, ValidatePromptResponse } from '../../types';
import { useSaveGeneratedProject } from '../../api/use-save-ai-project';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export type FlowStage =
    | 'idle'
    | 'validating'
    | 'generating'
    | 'generated'
    | 'saving';

export type FlowState =
    | { stage: 'idle' }
    | { stage: 'validating'; prompt: string }
    | { stage: 'generating'; prompt: string; validatedPrompt: string }
    // | { stage: 'generated'; data: ProjectData }
    | { stage: 'saving' }

export function useProjectFlow() {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const [flowState, setFlowState] = useState<FlowState>({ stage: 'idle' });
    const [chatMessage, setChatMessages] = useState<ChatMessage[]>([]);
    const [prompt, setPrompt] = useState("")
    const [lastPrompt, setLastPrompt] = useState("")
    const [project, setProject] = useState<ProjectData | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);


    const validateMutation = useValidatePrompt();
    const generateMutation = useGenerateProject();
    const saveMutation = useSaveGeneratedProject()

    const addMessage = useCallback((message: ChatMessage) => {
        setChatMessages(prev => [...prev, message]);
    }, []);

    const clearMessages = useCallback(() => {
        setChatMessages([]);
    }, []);

    const replaceLastMessage = useCallback((message: ChatMessage) => {
        setChatMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = message;
            return newMessages;
        });
    }, []);


    const startGeneration = useCallback(async (prompt: string) => {
        try {
            // Stage 1: Validation
            clearMessages();

            setFlowState({ stage: 'validating', prompt });

            addMessage({
                type: 'USER',
                prompt,
                timestamp: new Date()
            });

            const res = await validateMutation.mutateAsync({
                json: { prompt }
            })


            const validation = res as unknown as ValidatePromptResponse

            if (!validation.valid) {
                addMessage({
                    type: 'ERROR',
                    prompt: validation.reason || 'Validation failed',
                    errorType: validation.type || 'PROMPT_NOT_A_PROJECT',
                    timestamp: new Date(),
                    metadata: {
                        suggestions: validation.suggestions,
                        ...validation.metadata
                    },
                    actions: generateErrorActions(validation.type || 'PROMPT_NOT_A_PROJECT', {
                        onEdit: () => onEdit(prompt),
                        onRetry: () => startGeneration(prompt),
                        onReset: () => reset()
                    }),
                    onSuggestion: (suggestion) => { startGeneration(suggestion) },
                });

                return;
            }

            // Stage 2: Generation
            setFlowState({
                stage: 'generating',
                prompt,
                validatedPrompt: validation.rewrittenPrompt || prompt
            });

            const projectRes = await generateMutation.mutateAsync({
                json: {
                    prompt: validation.rewrittenPrompt || prompt
                }
            }
            );
            const projectData = projectRes as unknown as ProjectData

            // Stage 3: Stream the result
            // save the last used prompt for regeneration
            // setFlowState({
            //     stage: "generated",
            //     data: projectData
            // })
            const lastPrompt = validation.rewrittenPrompt ?? prompt
            addMessage({
                type: "AI",
                projectTask: projectData,
                handleStreamComplete: handleStreamComplete,
                actions: [
                    {
                        label: 'Regenerate', variant: 'outline', onClick: () => {
                            handleRegenerate()
                        }
                    },
                    { label: 'Open', variant: 'outline', onClick: openPanel },
                    { label: 'Save', variant: 'primary', onClick: () => { saveProject(projectData) } },
                ],
            })
            setIsPanelOpen(false)
            setProject(projectData)

        } catch (error: any) {
            handleError(error, prompt);
        }
    }, [validateMutation, generateMutation, addMessage, clearMessages])

    const handleError = useCallback((error: unknown, originalPrompt: string) => {
        let appError: ProjectError;
        if (error instanceof ProjectError) {
            appError = error;
        } else if (error instanceof Error) {
            appError = new ProjectError(
                'SERVER_ERROR',
                error.message,
                true
            );
        } else {
            appError = new ProjectError(
                'SERVER_ERROR',
                'An unexpected error occurred',
                true
            );
        }

        const failedAtGeneration = flowState.stage === 'generating';

        addMessage({
            type: 'ERROR',
            prompt: appError.message,
            errorType: appError.type,
            timestamp: new Date(),
            metadata: appError.metadata,
            actions: generateErrorActions(appError.type, {
                onEdit: () => reset(),
                onRetry: () => {
                    if (failedAtGeneration && 'validatedPrompt' in flowState) {
                        // Retry generation with validated prompt (skip validation)
                        retryGeneration(flowState.validatedPrompt);
                    } else {
                        // Retry from beginning
                        startGeneration(originalPrompt);
                    }
                },
                onReset: () => reset(),
                retryAfter: appError.metadata?.retryAfter
            }),
            onSuggestion: (suggestion) => { startGeneration(suggestion) },
        });

    }, [flowState, addMessage, startGeneration])

    const retryGeneration = useCallback(async (validatedPrompt: string) => {
        // Stay in generating stage
        setFlowState({
            stage: 'generating',
            prompt: validatedPrompt,
            validatedPrompt
        });

        // find the index pf the regenerated chat and continue from there
        console.log(chatMessage)
        const lastChat = chatMessage[chatMessage.length - 1];
        if (lastChat.type == "AI") {
            // remove it
            setChatMessages(prev => prev.slice(0, -1));
        }
        try {
            const projectRes = await generateMutation.mutateAsync({
                json: {
                    prompt: validatedPrompt
                }
            }
            );

            // Success
            const projectData = projectRes as unknown as ProjectData
            const lastPrompt = validatedPrompt
            addMessage({
                type: "AI",
                projectTask: projectData,
                handleStreamComplete: handleStreamComplete,
                actions: [
                    {
                        label: 'Regenerate', variant: 'outline', onClick: () => {
                            handleRegenerate()
                        }
                    },
                    { label: 'Open', variant: 'outline', onClick: openPanel },
                    { label: 'Save', variant: 'primary', onClick: () => { saveProject(projectData) } },
                ],
            })
            setIsPanelOpen(false)
            setProject(projectData)

        } catch (error) {
            handleError(error, validatedPrompt);
        }
    }, [generateMutation, addMessage, handleError, chatMessage]);

    const openPanel = useCallback(() => {
        console.log(isPanelOpen, chatMessage, prompt)
        setIsPanelOpen(true)
    }, [])

    const saveProject = useCallback(async (project: ProjectData) => {

        setFlowState({
            stage: "saving"
        })
        const save = await saveMutation.mutateAsync({
            json: {
                workspaceId: workspaceId,
                data: project
            }
        })
        if (save.data) {
            toast.success("project saved successfully!")
            router.push(`/workspaces/${workspaceId}/projects/${save.data.id}`)
            reset()
        }

    }, [flowState])

    const reset = useCallback(() => {
        setFlowState({ stage: 'idle' });
        clearMessages();
        validateMutation.reset();
        generateMutation.reset();
    }, [clearMessages, validateMutation, generateMutation]);

    const onEdit = useCallback((prompt: string) => {
        setFlowState({ stage: 'idle' });
        setPrompt(prompt)
        validateMutation.reset();
        generateMutation.reset();
    }, [prompt, validateMutation, generateMutation]);

    const regenerate = () => {
        if (flowState.stage === 'generating') {
            console.log(flowState, chatMessage)
            const originalPrompt = flowState.prompt; // Fallback
            startGeneration(originalPrompt);
            setIsPanelOpen(false)
        }
    };
    const handleRegenerate = () => {
        if (flowState.stage === 'generating') {
            let originalPrompt = flowState.validatedPrompt;
            const index = [...chatMessage].findLastIndex(m => m.type === 'AI');
            if (index === -1) {
                toast.error("No user prompt found to regenerate")
                return
            }
            console.log(flowState, chatMessage)
            // setChatMessages(prev => prev.slice(0, -1));
            setChatMessages(prev => {
                const newMessages = [...prev];
                newMessages.slice(0, index + 1)
                return newMessages;
            });
            retryGeneration(originalPrompt);

        }

        else {
            toast.error("No user prompt found to regenerate")
        }
    }
    const handleStreamComplete = useCallback(() => {
        setIsPanelOpen(true)
    }, [])

    return {
        flowState,
        startGeneration,
        reset,
        regenerate,
        isLoading: validateMutation.isPending || generateMutation.isPending || saveMutation.isPending,
        chatMessage,
        prompt,
        project,
        isPanelOpen,
        setIsPanelOpen,
        openPanel,
        saveProject,
        handleRegenerate
    };
}

function generateErrorActions(
    errorType: ErrorType,
    handlers: {
        onEdit: () => void;
        onRetry: () => void;
        onReset: () => void;
        retryAfter?: number;
    }
): ErrorAction[] {
    const { onEdit, onRetry, onReset, retryAfter } = handlers;

    switch (errorType) {
        // Validation errors - offer edit or suggestions
        case 'PROMPT_TOO_SHORT':
        case 'PROMPT_TOO_LONG':
        case 'PROMPT_NOT_A_PROJECT':
        case 'PROMPT_CONTAINS_MALICIOUS_CONTENT':
            return [
                { label: 'Edit Prompt', variant: 'primary', onClick: onEdit }
            ];
        case 'PROMPT_TOO_VAGUE':
        case 'PROMPT_CONTAINS_MULTIPLE_PROJECTS':
            return [
                { label: 'Edit my prompt instead', variant: 'ghost', onClick: onEdit }
            ];

        // Network errors - offer retry
        case 'VALIDATION_NETWORK_ERROR':
        case 'GENERATION_NETWORK_ERROR':
        case 'BROWSER_OFFLINE':
            return [
                { label: 'Retry', variant: 'primary', onClick: onRetry },
                { label: 'Edit Prompt', variant: 'outline', onClick: onEdit }
            ];
        // AI timeout - offer retry or simplify
        case 'VALIDATION_AI_TIMEOUT':
        case 'GENERATION_TIMEOUT':
            return [
                { label: 'Retry Anyway', variant: 'primary', onClick: onRetry },
                { label: 'Edit Prompt', variant: 'outline', onClick: onEdit },
                { label: 'Start Over', variant: 'ghost', onClick: onReset }
            ];

        case 'AI_SERVICE_ERROR':
            return [
                { label: 'Retry Now', variant: 'primary', onClick: onRetry },
                { label: 'Try in 30s', variant: 'outline', onClick: onRetry, countdown: 30 },
                { label: 'Start Over', variant: 'ghost', onClick: onReset }
            ];

        // Rate limits - countdown only
        case 'AI_RATE_LIMIT_EXCEEDED':
        case 'RATE_LIMIT_USER_EXCEEDED':
            return [
                {
                    label: `Retry in ${retryAfter || 60}s`,
                    variant: 'primary',
                    onClick: onRetry,
                    countdown: retryAfter || 60
                }
            ];

        // Auto-retry errors - no manual actions
        case 'AI_INVALID_OUTPUT':
        case 'CIRCULAR_DEPENDENCY_DETECTED':
            return []; // Auto-retry happens automatically

        // Partial success 
        case 'GENERATION_PARTIAL_SUCCESS':
            return [
                { label: 'Continue with Current Tasks', variant: 'primary', onClick: () => {/* Accept partial */ } },
                { label: 'Try Again for All', variant: 'outline', onClick: onRetry },
                { label: 'Edit Task Count', variant: 'ghost', onClick: onEdit }
            ];

        // Complex project - break down
        case 'PROJECT_TOO_COMPLEX':
            return [
                { label: 'Edit Prompt', variant: 'ghost', onClick: onEdit }
            ];

        // Generic errors
        case 'SERVER_ERROR':
            primary:
            return [
                { label: 'Retry', variant: 'primary', onClick: onRetry },
                { label: 'Start Over', variant: 'outline', onClick: onReset }
            ];
    }

}

