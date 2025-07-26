import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Member, MemberRole } from "../types";
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";

const app = new Hono()
    .get("/",
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            try {
                const user = await requireAuth(c)

                if (!user) {
                    return c.json({ error: "Unauthorized" }, 401)
                }

                const { workspaceId } = c.req.valid("query")

                const member = await getMember({
                    workspaceId,
                    userId: user.id,
                })

                if (!member) {
                    return c.json({ error: "Unauthorized" }, 401)
                }

                const populateMembers = await db.member.findMany({
                    where: {
                        workspaceId
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                })
                console.log(populateMembers.length, "members")

                return c.json({
                    data: {
                        populateMembers
                    }
                })
            } catch (error) {
                console.error("member", error)
                return c.json({ error: "Something went wrong" }, 500)

            }
        }
    ).delete("/:memberId",
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }
            const { memberId } = c.req.param()



            const memberToDelete = await db.member.findUnique({
                where: {
                    id: memberId
                }
            })

            if (!memberToDelete) {
                return c.json({ error: "Cannot delete member not in workspace" }, 400)

            }

            // const allMembersInWorkspace = await databases.listDocuments(
            //     DATABASE_ID,
            //     MEMBERS_ID,
            //     [Query.equal("workspaceId", memberToDelete.$id)]
            // )

            const allMembersInWorkspace = await db.member.findMany({
                where: {
                    workspaceId: memberToDelete.workspaceId
                }
            })

            const member = await getMember({
                workspaceId: memberToDelete!.workspaceId,
                userId: user.id
            })


            if (!member) {
                return c.json({ error: "unauthorized" }, 401)
            }

            if (member.id !== memberToDelete!.id && member.role !== MemberRole.ADMIN) {
                return c.json({ error: "unauthorized" }, 401)

            }
            if (allMembersInWorkspace.length === 1) {
                return c.json({ error: "Cannot delete the only member in the workspace" }, 400)

            }


            await db.member.delete({
                where: {
                    id: memberId
                }
            })

            return c.json({ data: { id: memberToDelete.id } })

        }
    ).patch("/:memberId",
        zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }
            const { memberId } = c.req.param()
            const role = c.req.valid("json")

            const memberToUpdate = await db.member.findUnique({
                where: {
                    id: memberId
                }
            })

            if (!memberToUpdate) {
                return c.json({ error: "Cannot delete member not in workspace" }, 400)

            }
            const allMembersInWorkspace = await db.member.findMany({
                where: {
                    workspaceId: memberToUpdate?.id
                }
            })
            const member = await getMember({
                workspaceId: memberToUpdate.workspaceId,
                userId: user.id
            })

            if (!member) {
                return c.json({ error: "unauthorized" }, 401)
            }

            if (member.role !== MemberRole.ADMIN) {
                return c.json({ error: "unauthorized" }, 401)

            }






            await db.member.update({
                where: {
                    id: memberId
                },
                data: {
                    role: role.role
                }
            })

            return c.json({ data: { id: memberToUpdate.id } })
        }
    )


export default app