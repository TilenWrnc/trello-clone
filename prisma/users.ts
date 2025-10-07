"use server";

import { prisma } from "@/lib/prisma";

export default async function getUsers(userId:string) {
    try {
        return await prisma.user.findMany({
            where: {
                id: {
                    not: userId,
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
                workspacesMember: {
                    select: {
                        id: true,
                    }
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}