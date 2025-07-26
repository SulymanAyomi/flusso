import { getToken } from "next-auth/jwt"
import type { Context } from "hono"
import { AuthUser } from "@/features/auth/type"

export async function requireAuth(c: Context): Promise<AuthUser | null> {
  const token = await getToken({
    // @ts-ignore
    req: c.req.raw,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (!token || !token.email || !token.id) {
    return null
  }

  const user: AuthUser = {
    id: token.id as string,
    email: token.email,
    name: token.name as string,
    image: token.image as string

  }

  return user
}
