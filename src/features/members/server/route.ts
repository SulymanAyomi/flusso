import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "../utils";
import { Member, MemberRole } from "../types";
import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/require-auth";
import { errorResponse, successResponse } from "@/lib/api-response";

const app = new Hono()
    .get("/",
        zValidator("query", z.object({ workspaceId: z.string() })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.valid("query")
                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        deletedAt: null,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
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
                const myUser = populateMembers.find((m) => m.userId == user.id)

                return c.json(successResponse({
                    populateMembers,
                    workspace,
                    user: myUser
                }))
            } catch (error) {
                console.error("member", error)
                return c.json({ error: "Something went wrong" }, 500)
            }
        }
    ).delete("/:memberId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

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
        zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })), sessionMiddleware,
        async (c) => {
            const user = c.get("user");

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
    ).get("/owner",
        zValidator("query", z.object({ workspaceId: z.string(), userId: z.string() })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId, userId } = c.req.valid("query")
                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const owner = await db.member.findFirst({
                    where: {
                        userId: userId,
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
                if (!owner) {
                    return c.json(errorResponse("workspace not found"), 404);
                }
                return c.json(successResponse({
                    owner
                }))
            } catch (error) {
                console.error("member", error)
                return c.json({ error: "Something went wrong" }, 500)
            }
        }
    )


export default app