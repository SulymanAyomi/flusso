import { createTaskSchema } from "@/features/tasks/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono().post("/",
    zValidator("json", createTaskSchema),
    async (c) => {
        return c.json("hello")
    })

export default app