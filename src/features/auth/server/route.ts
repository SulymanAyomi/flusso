import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie"
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema, resetRequestSchema, resetSchema } from "../schema";
import { db } from "@/lib/db";
import bcrypt, { hash } from "bcrypt"
import crypto, { randomBytes } from "crypto"

const TOKEN_EXPIRATION_HOURS = 24


const app = new Hono()
    // .get("/current",
    //     (c) => {
    //      return {}
    //     }
    // )
    // .post("/login", zValidator("json", loginSchema), async (c) => {
    //     try {
    //         const { email, password } = c.req.valid("json")

    //         const { account } = await createAdminClient()

    //         const session = await account.createEmailPasswordSession(
    //             email,
    //             password,
    //         )

    //         if (!session) {
    //             return c.json({ error: "Invalid email or password " })
    //         }

    //         setCookie(c, AUTH_COOKIE, session.secret, {
    //             path: "/",
    //             httpOnly: true,
    //             secure: true,
    //             sameSite: "strict",
    //             maxAge: 60 * 60 * 24 * 30
    //         })

    //         return c.json({ success: true });
    //     } catch (e: any) {
    //         // throw new Error(e)
    //         return c.json({ success: false, error: e.message }, 400);
    //     }

    // }

    // )
    .post("/", zValidator("json", registerSchema), async (c) => {
        console.log("hello back")
        const { name, email, password } = c.req.valid("json")

        // Check if user already exists
        const existing = await db.user.findUnique({ where: { email } })
        if (existing) {
            return c.json({ success: false, message: "Email already registered" }, 401)
            // throw new Error("Email already registered")
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create user with emailVerified = null
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                emailVerified: null,
            },
        })
        // Generate email verification token
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 3600 * 1000)
        await db.verificationToken.create({
            data: {
                identifier: user.email!,
                token,
                expires,
            },
        })

        // Send confirmation email (using Nodemailer or any email service)
        // await sendVerificationEmail(user.email!, token)
        return c.json({ success: true, message: "User registered successfully" }, 201)


    })
    .post("/reset-request", zValidator("json", resetRequestSchema), async (c) => {
        const { email } = c.req.valid("json")

        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            return c.json({ success: false, message: "Email not found" }, 404)
        }

        const token = randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 mins

        await db.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expires,
            },
        })

        // TODO: Send email via your provider (e.g. Resend, Nodemailer, Mailgun)
        console.log(`Reset link: https://your-app.com/auth/reset-password?token=${token}`)

        return c.json({ success: true, message: "Password reset successfully" }, 200)
    })
    .post("/reset-password", zValidator("json", resetSchema), async (c) => {
        const { token, newPassword } = c.req.valid("json")

        const reset = await db.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        })

        if (!reset || reset.expires < new Date()) {
            return c.json({ error: "Token expired or invalid" }, { status: 400 })
        }

        const hashedPassword = await hash(newPassword, 10)

        await db.user.update({
            where: { id: reset.userId },
            data: { password: hashedPassword },
        })

        await db.passwordResetToken.delete({ where: { token } })

        return c.json({ success: true })

    })


export default app;