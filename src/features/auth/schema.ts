import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Minimum of 8 characters"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Minimum of 2 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Minimum of 8 characters"),
});
export const resetRequestSchema = z.object({
    email: z.string().email(),
});
export const requestProfileChangeSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    bio: z.string().max(160).optional(),
    imageUrl: z.string().url().optional().nullable(),
    imagePublicId: z.string().optional().nullable(),
});

export const resetSchema = z.object({
    token: z.string().min(2, "Minimum of 2 characters"),
    newPassword: z.string().min(8, "Minimum of 8 characters"),

});

export const verifyOTPSchema = z.object({
    vid: z.string(),
    otp: z.string().max(6).min(6),
})

export const verifyEmailChangeOTPSchema = z.object({
    vid: z.string(),
    otp: z.string().max(6).min(6),
    email: z.string().email(),
})