"use server";

import { prisma } from "@/lib/prisma";

export default async function createBoard(userId: string, workspaceId: string, formData: FormData) {
    try {
        const boardTitle = formData.get("board-title");

        if (typeof boardTitle !== "string") {
            return;
        }

        await prisma.board.create({
            data: {
                title: boardTitle,
                author: {
                    connect: {
                        id: userId
                    }
                },
                workspace: {
                    connect: {
                        id: workspaceId
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getAllBoards(workspaceId: string) {
    try {
        const boards = await prisma.board.findMany({
            where: {
                workspaceId: workspaceId   
            }
        })
        return boards; 
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function getSingleBoard(boardId: string) {
    try {
        return await prisma.board.findFirst({
            where: {
                id: boardId   
            },
            include: {
                card: true,
            }
            
        })
    } catch (error) {
        console.log(error)
    }
};

export async function deleteBoard(boardId: string) {
    try {
        await prisma.board.delete({
            where: {
                id: boardId,
            }
        })
    } catch (error) {
        console.log(error)
    }
}
