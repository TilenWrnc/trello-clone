"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBoard } from "@/prisma/boards";
import { deleteCard } from "@/prisma/cards";
import { deleteTask } from "@/prisma/tasks";
import { deleteWorkspace } from "@/prisma/workspaces";

interface DeleteConfirmModalProps {
    workspaceId?: string;
    onDeleteWorkspace?: () => void;
    boardId?: string;
    onDeleteBoard?: () => void;
    cardId?: string;
    onDeleteCard?: () => void;
    taskId?: string;
    onDeleteTask?: () => void;
    deleteText: string;
}

const DeleteConfirmModal = ({workspaceId, onDeleteWorkspace, boardId, onDeleteBoard, cardId, onDeleteCard, taskId, onDeleteTask, deleteText }: DeleteConfirmModalProps) => {
    return ( 
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    Delete {deleteText} 
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Are you sure you want to delete this {deleteText}?</DialogTitle>
                </DialogHeader>
                <Button variant="destructive" className="text-white" onClick={async() => {
                        if(workspaceId && onDeleteWorkspace) {
                            await deleteWorkspace(workspaceId);
                            onDeleteWorkspace();
                        } else if (boardId && onDeleteBoard) {
                            await deleteBoard(boardId);
                            onDeleteBoard();
                        } else if (cardId && onDeleteCard) {
                            await deleteCard(cardId);
                            onDeleteCard();
                        } else if (taskId && onDeleteTask) {
                            await deleteTask(taskId);
                            onDeleteTask();
                        }
                    }}
                    >Confirm
                </Button>
            </DialogContent>
        </Dialog>
     );
}
 
export default DeleteConfirmModal;