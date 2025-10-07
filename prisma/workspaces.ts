"use server";

import { prisma } from "@/lib/prisma";

export default async function createWorkspace(userId: string, formData: FormData) {
    try {
        const workspaceTitle = formData.get("workspace-title");

        if (typeof workspaceTitle !== "string") {
            return;
        }

        return await prisma.workspace.create({
            data: {
                title: workspaceTitle,
                author: {
                    connect: {
                        id: userId
                    }
                },
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getAllWorkspaces(userId: string) {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                authorId: userId,
            }
        })
        return workspaces; 
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function getOtherUserWorkspaces(userId: string) {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                authorId: {
                    not: userId,
                },
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
                title: true,
                author: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            }
        })
        return workspaces; 
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function getCurrentWorkspace(workspaceId: string) {
    try {
        return await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
            },
            include: {
                members: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
                
            },
        })
    } catch (error) {
        console.log(error)
    }
};

export async function deleteWorkspace(workspaceId: string) {
    try {
        await prisma.workspace.delete({
            where: {
                id: workspaceId,
            }
        })
    } catch (error) {
        console.log(error)
    }
};

export async function addUsersToWorkspace(workspaceId: string, userId: string) {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                workspacesMember: {
                    connect: {
                        id: workspaceId,
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
};

export async function removeUsersFromWorkspace(workspaceId: string, userId: string) {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                workspacesMember: {
                    disconnect: {
                        id: workspaceId,
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
};