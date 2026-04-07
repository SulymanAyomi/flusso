import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie"
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema, resetRequestSchema, resetSchema, verifyOTPSchema } from "../schema";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"
import crypto, { randomBytes } from "crypto"
import { sendOTPEmail } from "@/features/email/resend/resend";
import { errorResponse, successResponse } from "@/lib/api-response";

const TOKEN_EXPIRATION_HOURS = 24

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
const app = new Hono()
    .post("/", zValidator("json", registerSchema), async (c) => {
        try {
            const { name, email, password } = c.req.valid("json")

            // Check if user already exists
            const existing = await db.user.findUnique({ where: { email } })
            if (existing) {
                return c.json(errorResponse("Email already registered"), 401)
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Generate email verification token
            // 1 generate OTP
            const otp = generateOTP()

            // 2 hash otp
            const hashedOtp = await bcrypt.hash(otp, 10)

            // 3 save to db

            const result = await db.$transaction(async (tx) => {
                // Create user with emailVerified = null

                await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        emailVerified: null,
                    },
                })

                const vt = await tx.verificationToken.upsert({
                    where: { email },
                    update: {
                        email,
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000),
                        attempts: 0,
                        createdAt: new Date()
                    },
                    create: {
                        email,
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000)
                    }
                })
                return vt
            })

            console.log(otp)
            //  send otp
            await sendOTPEmail({
                to: email,
                code: otp
            })
            const data = {
                vid: result.id,
                email
            }
            return c.json(successResponse(data, "User registered successfully"), 201);

        } catch (e) {
            console.log(e)
            return c.json(errorResponse("Something went wrong. Try again"), 500)
        }
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
        try {

            const { token, newPassword } = c.req.valid("json")

            const reset = await db.passwordResetToken.findUnique({
                where: { token },
                include: { user: true },
            })

            if (!reset || reset.expires < new Date()) {
                return c.json(errorResponse("Token expired or invalid"), { status: 400 })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await db.$transaction(async (tx) => {
                await tx.user.update({
                    where: { id: reset.userId },
                    data: { password: hashedPassword },
                })

                await tx.passwordResetToken.delete({ where: { token } })
            })

            return c.json(successResponse({ success: true }), 200)
        } catch (error) {
            return c.json(errorResponse("Something went wrong"), 500);

        }
    }).post("/verify-otp", zValidator("json", verifyOTPSchema), async (c) => {
        try {
            const { vid, otp } = c.req.valid("json")

            const record = await db.verificationToken.findUnique({
                where: {
                    id: vid
                },
            })

            if (!record) {
                return c.json(errorResponse("Code invalid"), 400)
            }

            if (record.expires < new Date()) {
                await db.verificationToken.delete({ where: { email: record.email } })
                return c.json(errorResponse("Code expired"), 400)
            }

            if (record.attempts >= 5) {
                await db.verificationToken.delete({ where: { email: record.email } })
                return c.json(errorResponse("Too many attempts"), 429)

            }

            const isValid = await bcrypt.compare(otp, record.otp)
            if (!isValid) {
                await db.verificationToken.update({ where: { email: record.email }, data: { attempts: { increment: 1 } } })
                return c.json(errorResponse("Code invalid"), 400)

            }
            await db.$transaction(async (tx) => {
                // Create user with emailVerified = null
                await tx.user.update({
                    where: {
                        email: record.email
                    },
                    data: {
                        emailVerified: true,
                    },
                })
                await tx.verificationToken.delete({ where: { email: record.email } });
            })
            return c.json(successResponse("", "Code valid, proceed to login"), 200);

        } catch (error) {
            return c.json(errorResponse("Something went wrong"), 500)
        }
    }
    ).get("/request-otp",
        zValidator("query", resetRequestSchema),
        async (c) => {
            try {
                const { email } = c.req.valid("query")
                // let email = "doe@gmail.com";
                // Check if user already exists
                const existing = await db.user.findUnique({ where: { email } })
                if (!existing) {
                    return c.json(errorResponse("User does not exist"), 401)
                }

                // Generate email verification token
                // 1 generate OTP
                const otp = generateOTP()

                // 2 hash otp
                const hashedOtp = await bcrypt.hash(otp, 10)

                // 3 save to db
                const vt = await db.verificationToken.upsert({
                    where: { email },
                    update: {
                        email,
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000),
                        attempts: 0,
                        createdAt: new Date()
                    },
                    create: {
                        email,
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000)
                    }
                })

                console.log(otp)
                //  send otp
                // await sendOTPEmail({
                //     to: email,
                //     code: otp
                // })
                const data = {
                    vid: vt.id
                }
                return c.json(successResponse(data, "Otp code sent to email"), 200);

            } catch (e) {
                console.log(e)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }).post("/resend-otp", zValidator("json", resetRequestSchema), async (c) => {
            try {
                const { email } = c.req.valid("json")

                // Check user exists and is not already verified
                const user = await db.user.findUnique({ where: { email } })
                if (!user) return c.json(errorResponse("User not found"), 404)
                if (user.emailVerified) return c.json(errorResponse("Email already verified"), 400)

                // Rate limit — check how recently the last OTP was created
                const existing = await db.verificationToken.findUnique({ where: { email } })
                if (existing) {
                    const secondsSinceLast = (Date.now() - existing.createdAt.getTime()) / 1000
                    if (secondsSinceLast < 60) {
                        return c.json(errorResponse("Please wait before requesting another code"), 429)
                    }
                }

                const otp = generateOTP()
                const hashedOtp = await bcrypt.hash(otp, 10)

                const vt = await db.verificationToken.upsert({
                    where: { email },
                    update: {
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000),
                        attempts: 0,
                        createdAt: new Date()
                    },
                    create: {
                        email,
                        otp: hashedOtp,
                        expires: new Date(Date.now() + 10 * 60 * 1000)
                    }
                })

                console.log(otp)

                // const { success } = await sendOTPEmail({ to: email, code: otp })
                // if (!success) return c.json(errorResponse("Failed to send code. Try again"), 500)

                return c.json(successResponse({ vid: vt.id }, "Verification code sent"), 200)

            } catch (e) {
                console.log(e)
                return c.json(errorResponse("Something went wrong. Try again"), 500)
            }
        })


export default app;