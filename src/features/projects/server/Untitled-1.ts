


// ```
// **Recommendation:**
// Be consistent with button labels:
// - "Retry" = same input
// - "Edit prompt" = modify input
// - "Start fresh" = clear everything

// ### 5. **Missing: Partial Success Handling**

// What if generation **partially** succeeds?
// ```
// AI generates project ✅
// AI generates 10 tasks ✅
// AI generates 5 more tasks ❌ (times out)


// // When error occurs
// sessionStorage.setItem('generation_error', JSON.stringify({
//   error,
//   prompt,
//   timestamp: Date.now()
// }));

// // On page load
// useEffect(() => {
//   const savedError = sessionStorage.getItem('generation_error');
//   if (savedError) {
//     const { error, prompt, timestamp } = JSON.parse(savedError);
    
//     // Only restore if error is recent (< 5 minutes)
//     if (Date.now() - timestamp < 5 * 60 * 1000) {
//       setErrorState(error);
//       setPrompt(prompt);
//     }
    
//     sessionStorage.removeItem('generation_error');
//   }
// }, []);


// try {
//   const project = await generateProject(cachedValidation.rewrittenPrompt);
  
//   // Success!
//   setChatMessages(prev => [
//     ...prev,
//     { type: 'assistant', text: 'Project generated.' }
//   ]);
  
//   setFlowState({ stage: 'review', data: project });
  
// } catch (error) {
//   trackError(error, { 
//     stage: 'generation', 
//     prompt: cachedValidation.rewrittenPrompt 
//   });
  
//   // Determine retry strategy
//   const shouldAutoRetry = 
//     error.type === 'INVALID_OUTPUT' || 
//     error.type === 'AI_ERROR';
  
//   if (shouldAutoRetry && retryCount < 1) {
//     // Auto-retry once (silent to user)
//     setRetryCount(prev => prev + 1);
//     setTimeout(() => generateProject(cachedValidation.rewrittenPrompt), 1000);
//     return;
//   }
  
//   // Show error with appropriate actions
//   const errorConfig = {
//     'TIMEOUT': {
//       message: 'Generation took too long. Try simplifying your project.',
//       actions: [
//         { label: 'Simplify prompt', onClick: handleSimplify },
//         { label: 'Retry anyway', onClick: handleRetry }
//       ]
//     },
//     'RATE_LIMIT': {
//       message: `Too many requests. Please wait ${error.retryAfter}s.`,
//       actions: [
//         { 
//           label: `Retry in ${error.retryAfter}s`, 
//           countdown: error.retryAfter,
//           onClick: handleRetry 
//         }
//       ]
//     },
//     'AI_ERROR': {
//       message: 'AI service temporarily unavailable.',
//       actions: [
//         { label: 'Retry', onClick: handleRetry },
//         { label: 'Start fresh', onClick: handleReset }
//       ]
//     },
//     // ... etc
//   };
  
//   const config = errorConfig[error.type] || {
//     message: 'Something went wrong.',
//     actions: [
//       { label: 'Retry', onClick: handleRetry },
//       { label: 'Start fresh', onClick: handleReset }
//     ]
//   };
  
//   setChatMessages(prev => [
//     ...prev,
//     {
//       type: 'error',
//       text: config.message,
//       actions: config.actions
//     }
//   ]);
// }


// // ============================================================================
// // ERROR COMPONENT
// // ============================================================================

// // hooks/useProjectFlow.ts

// import { useState, useCallback } from 'react';
// import { useValidatePrompt, useGenerateProject } from './useProjectGeneration';
// import type { FlowState } from '@/types/flow';
// import type { ChatMessage } from '@/types/chat';
// import { ProjectError } from '@/types/errors';

// export function useProjectFlow() {
//   const [flowState, setFlowState] = useState<FlowState>({ stage: 'idle' });
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

//   const validateMutation = useValidatePrompt();
//   const generateMutation = useGenerateProject();

//   /**
//    * Add message to chat
//    */
//   const addMessage = useCallback((message: ChatMessage) => {
//     setChatMessages(prev => [...prev, message]);
//   }, []);

//   /**
//    * Clear all messages (reset chat)
//    */
//   const clearMessages = useCallback(() => {
//     setChatMessages([]);
//   }, []);

//   /**
//    * Replace last message (for auto-retry scenarios)
//    */
//   const replaceLastMessage = useCallback((message: ChatMessage) => {
//     setChatMessages(prev => {
//       const newMessages = [...prev];
//       newMessages[newMessages.length - 1] = message;
//       return newMessages;
//     });
//   }, []);

//   /**
//    * Start the generation flow
//    */
//   const startGeneration = useCallback(async (prompt: string) => {
//     // Reset chat and start fresh
//     clearMessages();
//     setFlowState({ stage: 'validating', prompt });

//     // Add user message
//     addMessage({
//       type: 'USER',
//       prompt,
//       timestamp: new Date()
//     });

//     // Add AI thinking message
//     addMessage({
//       type: 'AI',
//       prompt: 'Understanding your request...',
//       timestamp: new Date()
//     });

//     try {
//       // ============================================================
//       // STEP 1: VALIDATION
//       // ============================================================
//       const validation = await validateMutation.mutateAsync(prompt);

//       if (!validation.valid) {
//         // ❌ Validation failed - show error in chat
//         addMessage({
//           type: 'ERROR',
//           prompt: validation.reason || 'Validation failed',
//           errorType: validation.type || 'PROMPT_NOT_A_PROJECT',
//           timestamp: new Date(),
//           metadata: {
//             suggestions: validation.suggestions,
//             ...validation.metadata
//           },
//           actions: generateErrorActions(validation.type || 'PROMPT_NOT_A_PROJECT', {
//             onEdit: () => reset(),
//             onSuggestion: (suggestion) => startGeneration(suggestion),
//             onRetry: () => startGeneration(prompt)
//           })
//         });

//         // Stay in validating stage (don't move forward)
//         // User sees chat with error + actions
//         return;
//       }

//       // ✅ Validation succeeded
//       setFlowState({
//         stage: 'generating',
//         prompt,
//         validatedPrompt: validation.rewrittenPrompt || prompt
//       });

//       // Update chat
//       addMessage({
//         type: 'AI',
//         prompt: 'Initializing the project...',
//         timestamp: new Date()
//       });

//       // ============================================================
//       // STEP 2: GENERATION
//       // ============================================================
//       const project = await generateMutation.mutateAsync(
//         validation.rewrittenPrompt || prompt
//       );

//       // ✅ Generation succeeded
//       setFlowState({
//         stage: 'review',
//         data: project
//       });

//       addMessage({
//         type: 'AI',
//         prompt: 'Project generated.',
//         timestamp: new Date()
//       });

//     } catch (error) {
//       // ❌ Caught error (validation or generation)
//       handleError(error, prompt);
//     }
//   }, [validateMutation, generateMutation, addMessage, clearMessages]);

//   /**
//    * Handle errors by adding error message to chat
//    */
//   const handleError = useCallback((error: unknown, originalPrompt: string) => {
//     let appError: ProjectError;

//     if (error instanceof ProjectError) {
//       appError = error;
//     } else if (error instanceof Error) {
//       appError = new ProjectError(
//         'SERVER_ERROR',
//         error.message,
//         true
//       );
//     } else {
//       appError = new ProjectError(
//         'SERVER_ERROR',
//         'An unexpected error occurred',
//         true
//       );
//     }

//     // Determine which stage failed
//     const failedAtGeneration = flowState.stage === 'generating';

//     // Add error message to chat
//     addMessage({
//       type: 'ERROR',
//       prompt: appError.message,
//       errorType: appError.type,
//       timestamp: new Date(),
//       metadata: appError.metadata,
//       actions: generateErrorActions(appError.type, {
//         onEdit: () => reset(),
//         onRetry: () => {
//           if (failedAtGeneration && 'validatedPrompt' in flowState) {
//             // Retry generation with validated prompt (skip validation)
//             retryGeneration(flowState.validatedPrompt);
//           } else {
//             // Retry from beginning
//             startGeneration(originalPrompt);
//           }
//         },
//         onReset: () => reset(),
//         onSuggestion: (suggestion) => startGeneration(suggestion),
//         retryAfter: appError.metadata?.retryAfter
//       })
//     });

//     // Stay in current stage - user sees error in chat
//   }, [flowState, addMessage, startGeneration]);

//   /**
//    * Retry generation only (skip validation)
//    */
//   const retryGeneration = useCallback(async (validatedPrompt: string) => {
//     // Stay in generating stage
//     setFlowState({
//       stage: 'generating',
//       prompt: validatedPrompt,
//       validatedPrompt
//     });

//     // Add retry message
//     addMessage({
//       type: 'AI',
//       prompt: 'Retrying generation...',
//       timestamp: new Date()
//     });

//     try {
//       const project = await generateMutation.mutateAsync(validatedPrompt);

//       // Success
//       setFlowState({
//         stage: 'review',
//         data: project
//       });

//       addMessage({
//         type: 'AI',
//         prompt: 'Project generated.',
//         timestamp: new Date()
//       });

//     } catch (error) {
//       handleError(error, validatedPrompt);
//     }
//   }, [generateMutation, addMessage, handleError]);

//   /**
//    * Reset everything
//    */
//   const reset = useCallback(() => {
//     setFlowState({ stage: 'idle' });
//     clearMessages();
//     validateMutation.reset();
//     generateMutation.reset();
//   }, [clearMessages, validateMutation, generateMutation]);

//   return {
//     flowState,
//     chatMessages,
//     startGeneration,
//     reset,
//     isLoading: validateMutation.isPending || generateMutation.isPending,
//     isValidating: validateMutation.isPending,
//     isGenerating: generateMutation.isPending,
//   };
// }


// export interface ValidatePromptRequest {
//   prompt: string;
// }

// export interface ValidatePromptResponse {
//   valid: boolean;
//   reason?: string;
//   rewrittenPrompt?: string;
//   suggestions?: string[];
//   type?: ErrorType; // For validation failures
//   metadata?: {
//     currentLength?: number;
//     maxLength?: number;
//     detectedProjects?: string[];
//   };
// }

// export interface GenerateProjectRequest {
//   prompt: string; // Should be the rewrittenPrompt from validation
// }

// export interface GenerateProjectResponse {
//   project: Project;
//   tasks: Task[];
// }

// // Error Response (both endpoints)
// export interface ErrorResponse {
//   error: {
//     type: ErrorType;
//     message: string;
//     retryable: boolean;
//     metadata?: AppError['metadata'];
//   };
// }


// // app/api/projects/validate/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { validatePromptInputSchema } from '@/lib/validations/prompt';
// import { 
//   sanitizePrompt, 
//   containsMaliciousContent, 
//   validatePromptLength 
// } from '@/lib/validations/sanitize';
// import { checkRateLimit } from '@/lib/rate-limit';
// import { validatePromptWithAI } from '@/lib/ai/gemini';
// import { ZodError } from 'zod';

// /**
//  * POST /api/projects/validate
//  * 
//  * Validates user prompt before project generation
//  */
// export async function POST(request: NextRequest) {
//   const startTime = Date.now();

//   try {
//     // ================================================================
//     // 1. RATE LIMITING
//     // ================================================================
//     const ip = request.headers.get('x-forwarded-for') || 
//                request.headers.get('x-real-ip') || 
//                'unknown';

//     const rateLimit = checkRateLimit(ip, 10, 60000); // 10 requests per minute

//     // Add rate limit headers
//     const headers = {
//       'X-RateLimit-Limit': rateLimit.limit.toString(),
//       'X-RateLimit-Remaining': rateLimit.remaining.toString(),
//       'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
//     };

//     if (!rateLimit.allowed) {
//       return NextResponse.json(
//         {
//           error: {
//             type: 'RATE_LIMIT_USER_EXCEEDED',
//             message: `Too many requests. Please wait ${rateLimit.retryAfter} seconds.`,
//             retryable: false,
//             metadata: {
//               retryAfter: rateLimit.retryAfter
//             }
//           }
//         },
//         { 
//           status: 429,
//           headers: {
//             ...headers,
//             'Retry-After': rateLimit.retryAfter?.toString() || '60'
//           }
//         }
//       );
//     }

//     // ================================================================
//     // 2. PARSE & VALIDATE REQUEST BODY
//     // ================================================================
//     let body;
//     try {
//       body = await request.json();
//     } catch (error) {
//       return NextResponse.json(
//         {
//           error: {
//             type: 'VALIDATION_FAILED',
//             message: 'Invalid JSON in request body',
//             retryable: false
//           }
//         },
//         { status: 400, headers }
//       );
//     }

//     // Validate with Zod
//     let validatedInput;
//     try {
//       validatedInput = validatePromptInputSchema.parse(body);
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const firstError = error.errors[0];
        
//         // Handle length errors specially
//         if (firstError.code === 'too_small') {
//           return NextResponse.json(
//             {
//               valid: false,
//               reason: 'Your prompt is too short. Please describe your project in more detail.',
//               type: 'PROMPT_TOO_SHORT',
//               rewrittenPrompt: null,
//               suggestions: [
//                 'Create a marketing campaign for Q4',
//                 'Build a portfolio website with a blog',
//                 'Plan a product launch event'
//               ],
//               metadata: {
//                 currentLength: (body.prompt as string)?.length || 0,
//                 maxLength: 2000
//               }
//             },
//             { status: 200, headers }
//           );
//         }

//         if (firstError.code === 'too_big') {
//           return NextResponse.json(
//             {
//               valid: false,
//               reason: `Your prompt is too long (${(body.prompt as string).length} characters). Please keep it under 2,000 characters.`,
//               type: 'PROMPT_TOO_LONG',
//               rewrittenPrompt: null,
//               suggestions: null,
//               metadata: {
//                 currentLength: (body.prompt as string).length,
//                 maxLength: 2000
//               }
//             },
//             { status: 200, headers }
//           );
//         }

//         return NextResponse.json(
//           {
//             error: {
//               type: 'VALIDATION_FAILED',
//               message: firstError.message,
//               retryable: false
//             }
//           },
//           { status: 400, headers }
//         );
//       }

//       throw error;
//     }

//     // ================================================================
//     // 3. SANITIZE INPUT
//     // ================================================================
//     const sanitized = sanitizePrompt(validatedInput.prompt);

//     // ================================================================
//     // 4. SECURITY CHECKS
//     // ================================================================
//     if (containsMaliciousContent(sanitized)) {
//       return NextResponse.json(
//         {
//           valid: false,
//           reason: 'Your prompt contains invalid characters or patterns. Please remove any HTML, scripts, or special characters and try again.',
//           type: 'PROMPT_CONTAINS_MALICIOUS_CONTENT',
//           rewrittenPrompt: null,
//           suggestions: null
//         },
//         { status: 200, headers }
//       );
//     }

//     // ================================================================
//     // 5. LENGTH VALIDATION (Double-check after sanitization)
//     // ================================================================
//     const lengthCheck = validatePromptLength(sanitized);
    
//     if (!lengthCheck.valid) {
//       if (lengthCheck.error === 'TOO_SHORT') {
//         return NextResponse.json(
//           {
//             valid: false,
//             reason: 'Your prompt is too short. Please describe your project in more detail.',
//             type: 'PROMPT_TOO_SHORT',
//             rewrittenPrompt: null,
//             suggestions: [
//               'Create a marketing campaign for Q4',
//               'Build a portfolio website with a blog',
//               'Plan a product launch event'
//             ],
//             metadata: {
//               currentLength: lengthCheck.length,
//               maxLength: 2000
//             }
//           },
//           { status: 200, headers }
//         );
//       }

//       if (lengthCheck.error === 'TOO_LONG') {
//         return NextResponse.json(
//           {
//             valid: false,
//             reason: `Your prompt is too long (${lengthCheck.length} characters). Please keep it under 2,000 characters.`,
//             type: 'PROMPT_TOO_LONG',
//             rewrittenPrompt: null,
//             suggestions: null,
//             metadata: {
//               currentLength: lengthCheck.length,
//               maxLength: 2000
//             }
//           },
//           { status: 200, headers }
//         );
//       }
//     }

//     // ================================================================
//     // 6. AI VALIDATION
//     // ================================================================
    
//     // Create abort controller for timeout
//     const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

//     let aiResponse;
//     try {
//       aiResponse = await validatePromptWithAI(sanitized, controller.signal);
//     } catch (error: any) {
//       clearTimeout(timeout);

//       // Handle timeout
//       if (error.name === 'AbortError') {
//         return NextResponse.json(
//           {
//             error: {
//               type: 'VALIDATION_AI_TIMEOUT',
//               message: 'Validation took too long. Please try again or simplify your prompt.',
//               retryable: true
//             }
//           },
//           { status: 408, headers }
//         );
//       }

//       // Handle Gemini API errors
//       if (error.message?.includes('quota')) {
//         return NextResponse.json(
//           {
//             error: {
//               type: 'SERVER_ERROR',
//               message: 'AI service quota exceeded. Please try again later.',
//               retryable: false
//             }
//           },
//           { status: 503, headers }
//         );
//       }

 
//     } finally {
//       clearTimeout(timeout);
//     }

//     // ================================================================
//     // 7. RETURN RESPONSE
//     // ================================================================
    
//     const duration = Date.now() - startTime;
//     console.log(`[Validation] ${aiResponse.valid ? 'Valid' : 'Invalid'} - ${duration}ms - IP: ${ip}`);

//     if (aiResponse.valid) {
//       return NextResponse.json(
//         {
//           valid: true,
//           rewrittenPrompt: aiResponse.rewrittenPrompt,
//           reason: null,
//           suggestions: null
//         },
//         { status: 200, headers }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           valid: false,
//           reason: aiResponse.reason,
//           type: aiResponse.type,
//           rewrittenPrompt: null,
//           suggestions: aiResponse.suggestions,
//           metadata: aiResponse.detectedProjects ? {
//             detectedProjects: aiResponse.detectedProjects
//           } : undefined
//         },
//         { status: 200, headers }
//       );
//     }

//   } catch (error) {
//     console.error('Unexpected validation error:', error);

//     return NextResponse.json(
//       {
//         error: {
//           type: 'SERVER_ERROR',
//           message: 'An unexpected error occurred. Please try again.',
//           retryable: true,
//           metadata: {
//             errorId: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//           }
//         }
//       },
//       { status: 500 }
//     );
//   }
// }

// // ================================================================
// // CORS & OPTIONS (if needed)
// // ================================================================

// export async function OPTIONS(request: NextRequest) {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }



// export async function validatePromptWithAI(
//   prompt: string,
//   signal?: AbortSignal
// ): Promise<{
//   valid: boolean;
//   reason: string | null;
//   rewrittenPrompt: string | null;
//   type: string | null;
//   suggestions: string[] | null;
//   detectedProjects: string[] | null;
// }> {
//   const model = getValidationModel();
  
//   const systemPrompt = `You are a project planning validation assistant. Your job is to validate if a user's input describes a project that can be broken down into tasks.

// VALIDATION RULES:

// 1. VALID prompts describe projects with actionable outcomes:
//    ✓ "Build a marketing website for a SaaS product"
//    ✓ "Create a Q4 sales campaign"
//    ✓ "Plan a product launch event"
//    ✓ "Develop a mobile app for task management"

// 2. INVALID - NOT A PROJECT (type: PROMPT_NOT_A_PROJECT):
//    ✗ Greetings: "Hello", "Hi there"
//    ✗ Questions: "What is project management?", "How do I create tasks?"
//    ✗ Random text: "asdfghjkl", "test test"
//    ✗ Conversations: "Can you help me?"

// 3. INVALID - TOO VAGUE (type: PROMPT_TOO_VAGUE):
//    ✗ Too generic: "website", "app", "project"
//    ✗ No clear goal: "make something", "build stuff"
//    → Provide 3 specific suggestions based on the vague intent

// 4. INVALID - MULTIPLE PROJECTS (type: PROMPT_CONTAINS_MULTIPLE_PROJECTS):
//    ✗ "Build a website AND create a mobile app AND launch a campaign"
//    → List detected projects separately

// RESPONSE FORMAT:

// If VALID:
// {
//   "valid": true,
//   "rewrittenPrompt": "Clearer, more actionable version of the prompt",
//   "reason": null,
//   "type": null,
//   "suggestions": null,
//   "detectedProjects": null
// }

// If INVALID:
// {
//   "valid": false,
//   "reason": "Clear explanation of why it's invalid",
//   "rewrittenPrompt": null,
//   "type": "PROMPT_NOT_A_PROJECT | PROMPT_TOO_VAGUE | PROMPT_CONTAINS_MULTIPLE_PROJECTS",
//   "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"], // If applicable
//   "detectedProjects": ["Project 1", "Project 2"] // If multiple projects detected
// }

// Now validate this user input:`;

//   const result = await model.generateContent(
//     {
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: systemPrompt },
//             { text: `\n\nUser input: "${prompt}"` }
//           ]
//         }
//       ]
//     },
//     { signal }
//   );

//   const response = result.response;
//   const text = response.text();
  
//   return JSON.parse(text);
// }



// // Success
// {
//   "valid": true,
//   "rewrittenPrompt": "Create a comprehensive marketing campaign for Q4 2024 with social media, email, and content strategy",
//   "reason": null,
//   "suggestions": null
// }

// // Too Short
// {
//   "valid": false,
//   "reason": "Your prompt is too short. Please describe your project in more detail.",
//   "type": "PROMPT_TOO_SHORT",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Create a marketing campaign for Q4",
//     "Build a portfolio website with a blog",
//     "Plan a product launch event"
//   ],
//   "metadata": {
//     "currentLength": 4,
//     "maxLength": 2000
//   }
// }

// // Too Vague (AI response)
// {
//   "valid": false,
//   "reason": "Your prompt 'website' is too vague. What kind of website would you like to create?",
//   "type": "PROMPT_TOO_VAGUE",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Build a portfolio website to showcase design work",
//     "Create an e-commerce store for handmade products",
//     "Design a blog platform for tech tutorials"
//   ]
// }

// // Multiple Projects (AI response)
// {
//   "valid": false,
//   "reason": "You're describing multiple projects. I can only create one at a time.",
//   "type": "PROMPT_CONTAINS_MULTIPLE_PROJECTS",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Build a marketing website",
//     "Create a mobile app",
//     "Launch a social media campaign"
//   ],
//   "metadata": {
//     "detectedProjects": [
//       "Build a marketing website",
//       "Create a mobile app",
//       "Launch a social media campaign"
//     ]
//   }
// }

// // Rate Limit Error
// {
//   "error": {
//     "type": "RATE_LIMIT_USER_EXCEEDED",
//     "message": "Too many requests. Please wait 45 seconds.",
//     "retryable": false,
//     "metadata": {
//       "retryAfter": 45
//     }
//   }
// }

// // AI Timeout Error
// {
//   "error": {
//     "type": "VALIDATION_AI_TIMEOUT",
//     "message": "Validation took too long. Please try again or simplify your prompt.",
//     "retryable": true
//   }
// }

// // Success
// {
//   "valid": true,
//   "rewrittenPrompt": "Create a comprehensive marketing campaign for Q4 2024 with social media, email, and content strategy",
//   "reason": null,
//   "suggestions": null
// }

// // Too Short
// {
//   "valid": false,
//   "reason": "Your prompt is too short. Please describe your project in more detail.",
//   "type": "PROMPT_TOO_SHORT",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Create a marketing campaign for Q4",
//     "Build a portfolio website with a blog",
//     "Plan a product launch event"
//   ],
//   "metadata": {
//     "currentLength": 4,
//     "maxLength": 2000
//   }
// }

// // Too Vague (AI response)
// {
//   "valid": false,
//   "reason": "Your prompt 'website' is too vague. What kind of website would you like to create?",
//   "type": "PROMPT_TOO_VAGUE",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Build a portfolio website to showcase design work",
//     "Create an e-commerce store for handmade products",
//     "Design a blog platform for tech tutorials"
//   ]
// }

// // Multiple Projects (AI response)
// {
//   "valid": false,
//   "reason": "You're describing multiple projects. I can only create one at a time.",
//   "type": "PROMPT_CONTAINS_MULTIPLE_PROJECTS",
//   "rewrittenPrompt": null,
//   "suggestions": [
//     "Build a marketing website",
//     "Create a mobile app",
//     "Launch a social media campaign"
//   ],
//   "metadata": {
//     "detectedProjects": [
//       "Build a marketing website",
//       "Create a mobile app",
//       "Launch a social media campaign"
//     ]
//   }
// }

// // Rate Limit Error
// {
//   "error": {
//     "type": "RATE_LIMIT_USER_EXCEEDED",
//     "message": "Too many requests. Please wait 45 seconds.",
//     "retryable": false,
//     "metadata": {
//       "retryAfter": 45
//     }
//   }
// }

// // AI Timeout Error
// {
//   "error": {
//     "type": "VALIDATION_AI_TIMEOUT",
//     "message": "Validation took too long. Please try again or simplify your prompt.",
//     "retryable": true
//   }
// }


