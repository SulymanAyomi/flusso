import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema, requestProfileChangeSchema, resetRequestSchema, resetSchema, verifyEmailChangeOTPSchema, verifyOTPSchema } from "../schema";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"
import crypto, { randomBytes } from "crypto"
import { sendOTPEmail, sendPasswordRestEmail } from "@/features/email/resend/resend";
import { errorResponse, successResponse } from "@/lib/api-response";
import { sessionMiddleware } from "@/lib/require-auth";
import cloudinary from "@/lib/clodinary";
import { Role } from "@prisma/client";
import { PUBLIC_APP_URL } from "@/config";


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
            const { success, error } = await sendOTPEmail({ to: email, code: otp })
            if (error) c.json(errorResponse("Failed to send code. Try again"), 500)
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
        const link = `${PUBLIC_APP_URL}/reset-password?token=${token}`

        const { success, error } = await sendPasswordRestEmail({ to: email, user: user.name, link })
        if (error) console.log("Failed mailing code:", error)

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
                await tx.passwordResetToken.deleteMany({ where: { userId: reset.userId } })
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
                const { success, error } = await sendOTPEmail({ to: email, code: otp })
                if (error) console.log("Failed mailing code:", error)
                const data = {
                    vid: vt.id
                }
                return c.json(successResponse(data, "Otp code sent to email"), 200);

            } catch (e) {
                console.log(e)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    ).post("/resend-otp", zValidator("json", resetRequestSchema), async (c) => {
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

            const { success, error } = await sendOTPEmail({ to: email, code: otp })
            if (error) console.log("Failed mailing code:", error)

            return c.json(successResponse({ vid: vt.id }, "Verification code sent"), 200)

        } catch (e) {
            console.log(e)
            return c.json(errorResponse("Something went wrong. Try again"), 500)
        }
    }
    ).get("/profile",
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const dbUser = await db.user.findUnique({
                    where: {
                        id: user.id
                    },
                    select: {
                        name: true,
                        imageUrl: true,
                        email: true
                    }
                })
                if (!dbUser) {
                    return c.json(errorResponse("User not found"), 404)
                }

                return c.json(successResponse({
                    user: {
                        name: dbUser.name,
                        email: dbUser.email,
                        imageUrl: dbUser.imageUrl
                    }
                }))
            } catch (error) {
                console.error("member", error)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    ).get("/profile/workspaces",
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const members = await db.member.findMany({
                    where: {
                        userId: user.id
                    },
                    select: {
                        id: true,
                        workspaceId: true,
                        role: true,
                        joinedAt: true
                    }
                })

                const workspaces = await db.workspace.findMany({
                    where: {
                        id: {
                            in: members.map((m) => m.workspaceId)
                        }
                    }
                });

                const w = workspaces.map((w) => {
                    const member = members.find((m) => m.workspaceId == w.id);
                    return {
                        ...w,
                        role: member?.role ?? Role.VIEWER,
                        isOwner: member?.id === w.ownerId,
                        joinedAt: member?.joinedAt,
                    }

                })

                // const workspacesCount = await db.workspace.count({
                //     where: {
                //         id: {
                //             in: members.map((m) => m.workspaceId)
                //         }
                //     }
                // });

                // const workspaceOwnedCount = await db.workspace.count({
                //     where: {
                //         ownerId: {
                //             in: members.map((m) => m.id)
                //         }
                //     }
                // });

                // const projectCreatedCount = await db.project.count({
                //     where: {
                //         createdById: {
                //             in: members.map((m) => m.id)
                //         }
                //     }
                // })

                // const [taskAssigned, tasksCompleted, taskOverdue] = await Promise.all([
                //     db.task.count({
                //         where: {
                //             assignedToId: {
                //                 in: members.map((m) => m.id)

                //             }
                //         }
                //     }),
                //     db.task.count({
                //         where: {
                //             assignedToId: {
                //                 in: members.map((m) => m.id)
                //             },
                //             status: "DONE",
                //         }
                //     }),
                //     db.task.count({
                //         where: {
                //             assignedToId: {
                //                 in: members.map((m) => m.id)
                //             },
                //             dueDate: { lt: new Date() },
                //             NOT: { status: "DONE" },
                //         }
                //     })
                // ]);

                // const allActivities = await db.activity.findMany({
                //     where: {
                //         id: {
                //             in: members.map((m) => m.workspaceId)
                //         }
                //     }
                // })

                // const activitiesCount = await db.activity.findMany({
                //     where: {
                //         id: {
                //             in: members.map((m) => m.workspaceId)
                //         }
                //     }
                // })

                return c.json(successResponse({
                    workspaces: w,
                }))
            } catch (error) {
                console.error("user workspaces", error)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .patch("/profile", zValidator("json", requestProfileChangeSchema), sessionMiddleware, async (c) => {
        try {
            const user = c.get("user");
            const data = c.req.valid("json");

            const me = await db.user.findUnique({
                where: {
                    id: user.id
                }
            })

            const updateData: any = {};

            if (data.name !== undefined) {
                updateData.name = data.name.trim();
            }

            // if (data.bio !== undefined) {
            //     updateData.bio = data.bio?.trim() || null;
            // }

            if (data.imageUrl !== undefined) {
                updateData.imageUrl = data.imageUrl;
                updateData.imageUrlPublicId = data.imagePublicId;
            }

            if (data.imageUrl === null) {
                // User is removing avatar
                if (me?.imageUrl && me.imageUrlPublicId) {
                    await cloudinary.uploader.destroy(me.imageUrlPublicId);
                }

                updateData.imageUrl = null;
                updateData.imageUrlPublicId = null;
            }

            const updatedUser = await db.user.update({
                where: { id: user.id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    updatedAt: true,
                    imageUrl: true,
                },
            });
            return c.json(successResponse(updatedUser), 200)
        } catch (error) {
            console.error("UPDATE_PROFILE_ERROR", error);
            return c.json(errorResponse("Failed to update profile"), 500)
        }
    }
    ).post("/email/change-request",
        zValidator("json", resetRequestSchema),
        async (c) => {
            try {
                const { email } = c.req.valid("json")
                // let email = "doe@gmail.com";
                // Check if user already exists
                const existing = await db.user.findUnique({ where: { email } })
                if (existing) {
                    return c.json(errorResponse("This email is already in use."), 401)
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
                // const { success } = await sendOTPEmail({ to: email, code: otp })
                // if (!success) return c.json(errorResponse("Failed to send code. Try again"), 500)
                const data = {
                    vid: vt.id
                }
                return c.json(successResponse(data, "Otp code sent to email"), 200);

            } catch (e) {
                console.log(e)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }).post("/email/verify",
            zValidator("json", verifyEmailChangeOTPSchema), sessionMiddleware,
            async (c) => {
                try {

                    const user = c.get("user");

                    const { vid, otp, email } = c.req.valid("json")

                    const record = await db.verificationToken.findUnique({
                        where: {
                            id: vid,
                            email: email
                        },
                    })

                    if (!record) {
                        return c.json(errorResponse("Code invalid"), 400)
                    }

                    if (record.expires < new Date()) {
                        await db.verificationToken.delete({ where: { email: record.email } })
                        return c.json(errorResponse("Code expired"), 400)
                    }

                    if (record.attempts >= 3) {
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
                                email: record.email,
                                emailVerified: true,
                            },
                        })
                        await tx.verificationToken.delete({ where: { email: record.email } });
                    })

                    // send email change mail
                    return c.json(successResponse("", "Code valid, proceed to login"), 200);

                } catch (e) {
                    console.log(e)
                    return c.json(errorResponse("Something went wrong"), 500)
                }
            })


export default app;