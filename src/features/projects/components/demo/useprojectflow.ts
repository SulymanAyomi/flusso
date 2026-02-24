'use client';

import { useState } from 'react';
import { useProjectGeneration } from './useprojectgeneration';
import { ProjectData } from '../AI/project-preview';
import { useValidatePrompt } from '../../api/use-validate-prompt';
import { useAIGenerateProject } from '../../api/use-AI-generate-project';

export type FlowState =
    | { stage: 'idle' }
    | { stage: 'validating'; prompt: string }
    | { stage: 'generating'; prompt: string; validatedPrompt: string }
    | { stage: 'review'; data: ProjectData }
    | {
        stage: 'error';
        error: { type: string; message: string };
        prompt: string;
        failedAt: 'validation' | 'generation'
    };

export function useProjectFlow() {
    const [flowState, setFlowState] = useState<FlowState>({ stage: 'idle' });
    const { mutateAsync, isPending } = useValidatePrompt();
    const { mutateAsync: getProjects, isPending: getProjectsPending } = useAIGenerateProject();

    const startGeneration = async (prompt: string) => {
        try {
            // Stage 1: Validation
            setFlowState({ stage: 'validating', prompt });

            const validation = await mutateAsync({
                json: { prompt }
            });

            if (validation.data.feedback?.status === "invalid") {
                setFlowState({
                    stage: 'error',
                    error: {
                        type: 'VALIDATION_FAILED',
                        message: validation.data.feedback.reason || 'Invalid prompt'
                    },
                    prompt,
                    failedAt: 'validation'
                });
                return;
            }

            // Stage 2: Generation
            setFlowState({
                stage: 'generating',
                prompt,
                validatedPrompt: validation.data.feedback.rewritten || prompt
            });

            const project = await getProjects({
                json: {
                    prompt: validation.data.feedback.rewritten || prompt

                }
            }
            );

            // Stage 3: Review
            setFlowState({ stage: 'review', data: project.data.project });

        } catch (error: any) {
            const currentStage = flowState.stage;
            console.log(currentStage, error)
            setFlowState({
                stage: 'error',
                error: {
                    type: error.type || 'UNKNOWN_ERROR',
                    message: error.message || 'Something went wrong'
                },
                prompt,
                failedAt: currentStage === 'validating' ? 'validation' : 'generation'
            });
        }
    };

    const retry = () => {
        if (flowState.stage === 'error') {
            startGeneration(flowState.prompt);
        }
    };

    const reset = () => {
        setFlowState({ stage: 'idle' });
    };

    const regenerate = () => {
        if (flowState.stage === 'review') {
            const originalPrompt = flowState.data.project.name; // Fallback
            startGeneration(originalPrompt);
        }
    };

    return {
        flowState,
        startGeneration,
        retry,
        reset,
        regenerate,
        isLoading: isPending || getProjectsPending
    };
}