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

export const resetSchema = z.object({
    token: z.string().min(2, "Minimum of 2 characters"),
    newPassword: z.string().min(8, "Minimum of 8 characters"),

});