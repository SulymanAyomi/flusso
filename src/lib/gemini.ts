import { GEMINI_AI } from "@/config";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai"
import { GenerateProjectSystemPrompt, ValidatePromptSystemPrompt } from "./prompt";
import { geminiGenerationSchema, geminiValidationSchema } from "@/features/projects/types";

export const safetySetting = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    }
]

export const ai = new GoogleGenAI({
    apiKey: GEMINI_AI,
})

// console.log(sanitized)
// const result = await ai.models.generateContent({
//     model: "gemini-flash-lite-latest",
//     contents: validationPrompt(prompt),
//     config: {
//         safetySettings: safetySetting,
//         responseMimeType: "application/json",
//         responseSchema: geminiValidationSchema,
//         temperature: 0.3,
//         maxOutputTokens: 500
//     }
// }) 
export async function validatePromptWithAI(prompt: string,
    signal?: AbortSignal) {
    const result = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: [
            {
                role: "user",
                parts: [
                    { text: ValidatePromptSystemPrompt },
                    { text: `\n\n"${prompt}"` }
                ]
            }
        ],
        config: {
            safetySettings: safetySetting,
            responseMimeType: "application/json",
            responseSchema: geminiValidationSchema,
            temperature: 0.3,
            maxOutputTokens: 500
        }
    })

    const AIResponse = result.text
    console.log(AIResponse)
    return JSON.parse(AIResponse!);
}
export async function generateProjectWithAI(prompt: string,
    signal?: AbortSignal): Promise<{
        project: {
            name: string;
            description: string;
            estimatedDurationDays: number;
        };
        tasks: Array<{
            title: string;
            description: string;
            priority: 'low' | 'medium' | 'high';
            tags: string[];
            dependsOn: string[]; // Task titles
            estimatedDays: number;
        }>;
    }> {
    const result = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: [
            {
                role: "user",
                parts: [
                    { text: GenerateProjectSystemPrompt },
                    { text: `\n\n"${prompt}"` }
                ]
            }
        ],
        config: {
            safetySettings: safetySetting,
            responseMimeType: "application/json",
            responseSchema: geminiGenerationSchema,
            temperature: 0.3,
            maxOutputTokens: 500
        }
    })

    const AIResponse = result.text
    console.log(AIResponse)
    return JSON.parse(AIResponse!);
}