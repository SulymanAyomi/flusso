import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "../utils";
import { Member, Role } from "../types";
import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/require-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { assignMemberProject } from "../schema";
import { ProjectRole } from "@prisma/client";

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
            try {
                const user = c.get("user");

                const { memberId } = c.req.param()

                const memberToDelete = await db.member.findUnique({
                    where: {
                        id: memberId
                    },
                    include: {
                        workspace: true
                    }
                })

                if (!memberToDelete) {
                    return c.json(errorResponse("Cannot remove member not in workspace"), 400)
                }

                if (memberToDelete.workspace.ownerId == memberToDelete.id) {
                    return c.json(errorResponse("Cannot remove workspace owner"), 400)

                }
                const allMembersInWorkspace = await db.member.findMany({
                    where: {
                        workspaceId: memberToDelete.workspaceId
                    }
                })

                const currentUserMember = allMembersInWorkspace.find((m) => m.userId == user.id)

                if (!currentUserMember || currentUserMember.role !== Role.ADMIN) {
                    return c.json(errorResponse("You do not have permission to perform action"), 401)
                }

                if (allMembersInWorkspace.length === 1) {
                    return c.json(errorResponse("Cannot delete the only member in the workspace"), 400)
                }

                if (allMembersInWorkspace.filter((m) => m.role == Role.ADMIN).length === 1) {
                    return c.json(errorResponse("Cannot delete the only admin in the workspace"), 400)
                }

                await db.member.delete({
                    where: {
                        id: memberId
                    }
                })

                return c.json(successResponse({ id: memberToDelete.id }), 200)
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)

            }
        }
    ).patch("/:memberId",
        zValidator("json", z.object({ role: z.nativeEnum(Role), workspaceId: z.string() })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const { memberId } = c.req.param()
                const { role, workspaceId } = c.req.valid("json")

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        deletedAt: null,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    },
                    include: {
                        members: true
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const memberToUpdate = workspace.members.find((m) => m.id == memberId)

                // const memberToUpdate = await db.member.findUnique({
                //     where: {
                //         id: memberId
                //     }
                // })
                if (!memberToUpdate) {
                    return c.json(errorResponse("member not in workspace"), 400)
                }
                // const currentUserMember = await getMember({
                //     workspaceId: memberToUpdate.workspaceId,
                //     userId: user.id
                // })
                const currentUserMember = workspace.members.find((m) => m.userId == user.id)

                if (!currentUserMember || currentUserMember.role !== Role.ADMIN) {
                    return c.json(errorResponse("You do not have permission to perform action"), 401)
                }
                if (
                    memberToUpdate.role === Role.ADMIN &&
                    role !== Role.ADMIN
                ) {
                    const adminsCount = await db.member.count({
                        where: {
                            workspaceId: memberToUpdate.workspaceId,
                            role: Role.ADMIN
                        }
                    })
                    if (adminsCount <= 1) {
                        return c.json(errorResponse("Cannot demote last admin"), 400)
                    }
                }

                await db.member.update({
                    where: { id: memberId },
                    data: { role: role }
                })

                return c.json(successResponse({ id: memberToUpdate.id, role }), 200)
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)

            }
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
    ).get("/:memberId/projects",
        zValidator("query", z.object({ workspaceId: z.string() })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.valid("query")
                const { memberId } = c.req.param()

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
                console.log(memberId)
                const member = await db.member.findFirst({
                    where: {
                        id: memberId
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        },
                        projectMembers: true
                    }
                })

                if (!member) {
                    return c.json(errorResponse("member not found"), 404);
                }

                return c.json(successResponse({
                    member
                }), 200)
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .patch("/:memberId/projects", zValidator("json", assignMemberProject), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { memberId } = c.req.param()
                const { projectsId } = c.req.valid("json")

                const currentUser = await db.member.findFirst({
                    where: {
                        userId: user.id,
                        workspace: {
                            deletedAt: null,
                            members: {
                                some: {
                                    userId: user.id,
                                    role: {
                                        in: ["ADMIN"]
                                    }
                                }
                            }
                        }
                    },
                    select: {
                        workspaceId: true
                    }
                })

                if (!currentUser) {
                    return c.json(errorResponse("Permission denied"), 403);
                }

                const workspaceId = currentUser.workspaceId;

                const member = await db.member.findFirst({
                    where: {
                        id: memberId,
                        workspaceId
                    },
                    select: {
                        id: true,
                        userId: true,
                        role: true
                    }
                });

                if (!member) {
                    return c.json(errorResponse("Member not found"), 404);
                }

                const validProjects = await db.project.findMany({
                    where: {
                        id: { in: projectsId },
                        workspaceId
                    },
                    select: { id: true }
                });

                if (validProjects.length !== projectsId.length) {
                    return c.json(errorResponse("Invalid project(s)"), 400);
                }

                const existing = await db.projectMember.findMany({
                    where: {
                        memberId: memberId,
                        project: { workspaceId }
                    },
                    select: { projectId: true }
                });

                const existingIds = existing.map(p => p.projectId);
                const toAdd = projectsId.filter(id => !existingIds.includes(id));
                const toRemove = existingIds.filter(id => !projectsId.includes(id));

                const role =
                    member.role == "VIEWER" ? ProjectRole.VIEWER : ProjectRole.CONTRIBUTOR;


                await db.$transaction([
                    db.projectMember.createMany({
                        data: toAdd.map(projectId => ({
                            projectId,
                            memberId: memberId,
                            userId: member.userId,
                            role
                        })),
                        skipDuplicates: true
                    }),

                    db.projectMember.deleteMany({
                        where: {
                            memberId: memberId,
                            projectId: { in: toRemove }
                        }
                    })
                ]);

                return c.json(
                    successResponse({
                        message: "Member assigned to projects successfully",
                        count: toAdd.length + toRemove.length,
                        memberId
                    }),
                    200
                );
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)

            }
        })

export default app