import NextAuth, { User, NextAuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
