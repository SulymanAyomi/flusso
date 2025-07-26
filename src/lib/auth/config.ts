import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"


import { db } from "@/lib/db";



export const authConfig = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
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
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/gmail.readonly openid email profile",
        },
      },

    })

  ],
  adapter: PrismaAdapter(db),


}
