import NextAuth, { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../db";
import { AuthUser } from "@/features/auth/type";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session {
        user: AuthUser
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: String;
        email: String;
        name: String;
        image: String;

    }
}

export const authOptions: NextAuthOptions =
{
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                // Validate input
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }
                // Look up user from the database
                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                })
                if (!user || !user.password) {
                    throw new Error("Invalid email or password")
                }
                // Verify password (using bcrypt)
                const isValid = await bcrypt.compare(credentials.password, user.password!)
                if (!isValid) {
                    throw new Error("Invalid email or password")
                }

                // Block unverified users here
                if (!user.emailVerified) {
                    throw new Error("EMAIL_NOT_VERIFIED")
                }

                // If credentials are valid, return user object
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.imageUrl ?? "",
                }

            },

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        error: "/sign-in",
        signIn: "/sign-in"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const existingUser = await db.user.findUnique({
                    where: { email: user.email! },
                })

                if (existingUser) {
                    // Link Google account
                    await db.user.update({
                        where: { id: existingUser.id },
                        data: {
                            emailVerified: true,
                            imageUrl: user.image
                        },
                    })
                }
                return true // Google users always pass through
            }

            if (account?.provider === "credentials") {
                const dbUser = await db.user.findUnique({
                    where: { email: user.email! },
                })
                // Belt-and-suspenders check alongside the authorize throw
                if (!dbUser?.emailVerified) return false
            }
            return true
        },

        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.email = user.email!
                token.name = user.name!
                token.image = user.image!
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
            }
            return session
        },
    },
    cookies: {
        sessionToken: {
            name: "__Secure-authjs.session-token",
            options: {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30
            },
        },
    },
}

export const getAuthSession = () => getServerSession(authOptions);

