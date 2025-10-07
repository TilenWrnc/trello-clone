"use server";

import { prisma } from "@/lib/prisma"

export default async function getAllCards(boardId: string) {
    try {
        return await prisma.card.findMany({
            where: {
                boardId: boardId,
            },
            include: {
                tasks: {
                    orderBy: {
                        order: "asc",
                    }
                }
            },
        });
    } catch (error) {
        console.log(error)
    }
}

export async function createCard(userId: string, boardId: string, formData: FormData) {
    try {
        const cardTitle = formData.get("card-title");

        if (typeof cardTitle !== "string") {
            return;
        }

        await prisma.card.create({
            data: {
                title: cardTitle,
                author: {
                    connect: {
                        id: userId
                    }
                },
                board: {
                    connect: {
                        id: boardId
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCard(cardId: string) {
    try {
        await prisma.card.delete({
            where: {
                id: cardId,
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getCardsLength(userId: string) {
    try {
        return await prisma.card.count({
            where: {
                authorId: userId,
            }
        });
    } catch (error) {
        console.log(error);
    }
}
