import { AuthUser } from "@/features/auth/type"
import { Context, Env } from "hono"

type CustomEnv = Env & {
    user: AuthUser
}

export type AppContext = Context<{ Variables: CustomEnv }>