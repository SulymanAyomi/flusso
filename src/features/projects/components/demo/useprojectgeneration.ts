'use client';

import { useMutation } from '@tanstack/react-query';

interface ValidationResponse {
    valid: boolean;
    rewrittenPrompt?: string;
    reason?: string;
}

interface GenerationResponse {
    project: {
        name: string;
        description: string;
        estimatedDurationDays: number;
        startDate?: string;
        endDate?: string;
    };
    tasks: Array<{
        id: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        tags: string[];
        dependsOn: string[];
        estimatedDays: number;
        dueDate: string;
    }>;
}

export function useProjectGeneration() {
    const validateMutation = useMutation({
        mutationFn: async (prompt: string): Promise<ValidationResponse> => {
            const res = await fetch('/api/projects/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;
            }

            return res.json();
        },
        retry: (failureCount, error: any) => {
            // Don't retry validation failures
            if (error.type === 'VALIDATION_FAILED') return false;
            // Retry network errors once
            return failureCount < 1;
        },
    });

    const generateMutation = useMutation({
        mutationFn: async (prompt: string): Promise<GenerationResponse> => {
            const res = await fetch('/api/projects/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;
            }

            return res.json();
        },
        retry: 1, // Retry generation once on failure
    });

    return {
        validateMutation,
        generateMutation,
    };
}