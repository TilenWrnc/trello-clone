"use server";

import { Priority } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma"
import { string } from "zod";


export async function createTask(userId: string, cardId: string, formData: FormData, priority: Priority, dueDate: Date) {
    try {
        const taskTitle = formData.get("task-title");

        if (typeof taskTitle !== "string") {
            return;
        }

        await prisma.task.create({
            data: {
                title: taskTitle,
                priority: priority,
                dueDate: dueDate,
                author: {
                    connect: {
                        id: userId
                    }
                },
                card: {
                    connect: {
                        id: cardId
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function updateTasks(taskId: string, newCardId: string, newIndex: number) {
    try {
        await prisma.task.update({
          where: { id: taskId },
          data: {
            cardId: newCardId,
            order: newIndex,
          },
        });
    } catch (error) {
        console.log(error)
    }
}

export async function deleteTask(taskId: string) {
    try {
        await prisma.task.delete({
          where: {
            id: taskId
          }
        });
    } catch (error) {
        console.log(error)
    }
};

export async function toggleCompleteTask(taskId: string) {
    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId
            },
            select: {
                completed: true,
            }
        })

        await prisma.task.update({
          where: {
            id: taskId
          },
          data: {
            completed: !task?.completed,
          }
        });
    } catch (error) {
        console.log(error)
    }
};
