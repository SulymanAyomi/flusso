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
    ).delete("/:memberId/:workspaceId", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { memberId, workspaceId } = c.req.param();

                // Fetch the requesting user's membership
                const requestingMember = await db.member.findUnique({
                    where: {
                        workspaceId_userId: {
                            userId: user.id,
                            workspaceId,
                        },
                    },
                });

                if (!requestingMember) {
                    return c.json(errorResponse("You are not a member of this workspace"), 403);
                }

                const isSelfRemoval = requestingMember.id === memberId;
                const isAdmin = requestingMember.role === Role.ADMIN;

                // Only admins can remove others; anyone can remove themselves
                if (!isAdmin && !isSelfRemoval) {
                    return c.json(errorResponse("You do not have permission to perform this action"), 403);
                }

                // Fetch the target member, scoped to this workspace to prevent cross-workspace attacks
                const memberToDelete = await db.member.findUnique({
                    where: {
                        id: memberId,
                        workspaceId, // ensures the member belongs to this workspace
                    },
                    include: {
                        workspace: true,
                    },
                });

                if (!memberToDelete) {
                    return c.json(errorResponse("Member not found in this workspace"), 404);
                }

                if (isSelfRemoval && memberToDelete.userId === memberToDelete.workspace.ownerId) {
                    return c.json(errorResponse("Transfer ownership before leaving the workspace"), 400);
                }
                // Prevent owner from being removed
                if (memberToDelete.userId === memberToDelete.workspace.ownerId) {
                    return c.json(errorResponse("Cannot remove the workspace owner"), 400);
                }

                // Prevent removing the last admin (guards both self-removal and admin removing another admin)
                if (memberToDelete.role === Role.ADMIN) {
                    const adminCount = await db.member.count({
                        where: {
                            workspaceId,
                            role: Role.ADMIN,
                        },
                    });

                    if (adminCount <= 1) {
                        return c.json(errorResponse("Cannot remove the only admin in the workspace"), 400);
                    }
                }
                console.log("Deleting member with ID:", memberId, "from workspace:", workspaceId);

                await db.$transaction(async (tx) => {
                    await db.projectMember.deleteMany({
                        where: {
                            memberId: memberId,
                            project: { workspaceId }
                        }
                    })
                    await db.member.delete({
                        where: { id: memberId },
                    });
                })

                return c.json(successResponse({ id: memberToDelete.id }), 200);
            } catch (error) {
                console.error("Error deleting member:", error);
                return c.json(errorResponse("Failed to remove member"), 500);
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
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const currentUserMember = await db.member.findUnique({
                    where: {
                        workspaceId_userId: {
                            userId: user.id,
                            workspaceId
                        }
                    }
                })

                if (!currentUserMember || currentUserMember.role !== Role.ADMIN) {
                    return c.json(errorResponse("You do not have permission to perform action"), 401)
                }

                const memberToUpdate = await db.member.findUnique({
                    where: {
                        id: memberId,
                        workspaceId: workspace.id
                    }
                })

                if (!memberToUpdate) {
                    return c.json(errorResponse("member not in workspace"), 400)
                }
                const isOwner = workspace.ownerId == memberToUpdate.id

                if (isOwner) {

                    if (memberToUpdate.role != "ADMIN") {
                        await db.member.update({
                            where: { id: memberId },
                            data: { role: "ADMIN" }
                        })
                    }

                    return c.json(errorResponse("cannot update owner role"), 401)
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
    )
    .get("/current-member",
        zValidator("query", z.object({ workspaceId: z.string() })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.valid("query")
                console.log(workspaceId)
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
                console.log(workspace)

                const member = await db.member.findUnique({
                    where: {
                        workspaceId_userId: {
                            userId: user.id,
                            workspaceId
                        }
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                imageUrl: true
                            }
                        }
                    }
                })
                console.log(member)
                if (!member) {
                    return c.json(errorResponse("workspace not found"), 404);
                }
                return c.json(successResponse({
                    member,
                    workspace,
                    isOwner: workspace.ownerId === member.id
                }))
            } catch (error) {
                console.error("member", error)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .get("/:memberId",
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
                const member = await db.member.findFirst({
                    where: { id: memberId, workspaceId },
                    include: {
                        user: { select: { name: true, email: true } },
                        projectMembers: {
                            select: {
                                project: {
                                    select: { id: true, name: true }
                                }
                            }
                        }
                    }
                });

                if (!member) {
                    return c.json(errorResponse("member not found"), 404);
                }

                const [taskAssigned, tasksCompleted, taskOverdue] = await Promise.all([
                    db.task.count({
                        where: {
                            assignedToId: member.id,
                            project: { workspaceId }
                        }
                    }),
                    db.task.count({
                        where: {
                            assignedToId: member.userId,
                            status: "DONE",
                            project: { workspaceId }
                        }
                    }),
                    db.task.count({
                        where: {
                            assignedToId: member.userId,
                            dueDate: { lt: new Date() },
                            NOT: { status: "DONE" },
                            project: { workspaceId }
                        }
                    })
                ]);

                const data = {
                    member: { ...member },
                    stats: {
                        taskAssigned: taskAssigned,
                        tasksCompleted,
                        taskOverdue
                    },
                    projects: member.projectMembers.map(pm => pm.project)
                }

                return c.json(successResponse({
                    data
                }), 200)
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .get("/:memberId/projects",
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

                const member = await db.member.findUnique({
                    where: {
                        workspaceId_userId: {
                            userId: user.id,
                            workspaceId
                        }
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
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
                ;
                const member = await db.member.findUnique({
                    where: {
                        workspaceId_userId: {
                            userId: user.id,
                            workspaceId
                        }
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                imageUrl: true
                            }
                        }
                    }
                })

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