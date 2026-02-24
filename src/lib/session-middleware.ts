// import {
//     Account,
//     Client,
//     Databases,
//     Models,
//     Storage,
//     type Account as AccountType,
//     type Databases as DatabasesType,
//     type Storage as StorageType,
//     type Users as UsersType,
// } from "node-appwrite"

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { db } from "./db";
import { getToken } from "next-auth/jwt";
import { MiddlewareHandler } from "hono";
import next from "next";
import { AppContext } from "./context";

type AdditionalContext = {
    Variables: {
        // account: AccountType;
        // databases: DatabasesType;
        // storage: StorageType;
        // users: UsersType;
        // user: Models.User<Models.Preferences>
    }
}



export const sessionMiddleware = createMiddleware(
    async (c, next) => {
        const session = getCookie(c, AUTH_COOKIE)
        console.log("backend session", session)

        const token = await getToken({
            // @ts-ignore
            req: c.req.raw,
            secret: process.env.NEXTAUTH_SECRET,
        })
        console.log("backend token", token)
        if (!token) {
            return c.json({ error: "Unauthorized" }, 401)
        }
        c.set("db", db)
        await next()
    }
)
// @ts-ignore
export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = await getToken({
        // @ts-ignore
        req: c.req.raw,
        secret: process.env.NEXTAUTH_SECRET,
    })
    console.log("backend token", token)
    if (!token || !token.email) {
        return c.json({ error: "Unauthorized" }, 401)
    }
    // @ts-ignore
    c.set("user", {
        id: token.id,
        email: token.email,
        name: token.name
    })
    await next()
}
