import "server-only"
import { createMiddleware } from "hono/factory";
import { AuthUser } from "@/features/auth/type"
import { getAuthSession } from "./auth";
import { errorResponse } from "./api-response";

type AdditionalContext = {
  Variables: {
    user: AuthUser
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = await getAuthSession()
    if (!session || !session.user) {
      return c.json(errorResponse("Unauthourized"), 401)
    }
    c.set("user", session.user)
    await next()
  }
)
