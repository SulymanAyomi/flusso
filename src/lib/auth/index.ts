import NextAuth, { getServerSession, NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../db";
import { AuthUser } from "@/features/auth/type";

declare module "next-auth" {
    interface Session {
        user: AuthUser
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: String;
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
                try {
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
                    const isValid = await import("bcrypt").then(bc =>
                        bc.compare(credentials.password, user.password!)
                    )
                    if (!isValid) {
                        throw new Error("Invalid email or password")
                    }
                    // If credentials are valid, return user object
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    }
                } catch (error: any) {
                    return null
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.image = user.image
            }
            return token;
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session;
        },
    },
}

export const getAuthSession = () => getServerSession(authOptions);
