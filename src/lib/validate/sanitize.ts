import sanitizeHtml from "sanitize-html";
/**
 * Sanitize prompt - remove HTML and excessive whitespace
 */
export function sanitizePrompt(prompt: string): string {
    // Remove all HTML tags
    const cleaned = sanitizeHtml(prompt, {
        allowedTags: [],
        allowedAttributes: {}
    });

    // Normalize whitespace
    return cleaned
        .trim()
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
}

/**
 * Check for malicious patterns
 */
export function containsMaliciousContent(prompt: string): boolean {
    const dangerousPatterns = [
        /<script/i,
        /<iframe/i,
        /javascript:/i,
        /onerror=/i,
        /onclick=/i,
        /onload=/i,
        /<embed/i,
        /<object/i,
        /eval\(/i,
        /expression\(/i,
        /vbscript:/i,
        /data:text\/html/i
    ];

    return dangerousPatterns.some(pattern => pattern.test(prompt));
}

/**
 * Validate prompt length
 */
export function validatePromptLength(prompt: string): {
    valid: boolean;
    error?: 'TOO_SHORT' | 'TOO_LONG';
    length: number;
} {
    const length = prompt.length;

    if (length < 10) {
        return { valid: false, error: 'TOO_SHORT', length };
    }

    if (length > 2000) {
        return { valid: false, error: 'TOO_LONG', length };
    }

    return { valid: true, length };
}