import { db } from "@/lib/db";
import crypto from "crypto";

export async function verifyPasswordToken(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await db.passwordResetToken.findUnique({
        where: {
            token: hashedToken,
        },
    });
    if (!record) {
        return { success: false, error: "Token expired or invalid" };
    }

    if (record.expires < new Date()) {
        await db.passwordResetToken.delete({
            where: {
                token: hashedToken,
            },
        });
        return { success: false, error: "Token expired or invalid" };
    }

    return { success: true, message: "Token exist" };
}