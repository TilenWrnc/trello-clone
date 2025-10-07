"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteWorkspace, getCurrentWorkspace } from "@/prisma/workspaces";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteConfirmModal from "../../(components)/delete-confirm-modal";
import Image from "next/image";
import createBoard, { getAllBoards } from "@/prisma/boards";
import { useSession } from "@/app/lib/auth-client";
import { toast } from "sonner";
import ManageMembers from "./manage-members";


export type WorkspaceMember = {
  name: string;
  image: string | null;
};

export type currentWorkspace = {
  id: string;
  title: string;
  authorId: string;
  members: WorkspaceMember[];
};

export type Board = {
  id: string;
  title: string;
};

const WorkspaceNavbar = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [currentWorkspace, setCurrentWorkspace] = useState<currentWorkspace | null>(null);
    const [boards, setBoards] = useState<Board[] | []>([]);
    const [isOpen, setIsOpen] = useState(false);

    function onDeleteBoard(boardId: string) {
        setBoards(prev => prev.filter(board => board.id !== boardId));
        router.push("/dashboard");
    };
    
    const workspaceId = params.workspaceId;

    if (!workspaceId || Array.isArray(workspaceId)) {
        return <Loader  className="animate-spin"/>;
    };
    
    const fetchWorkspaceData = async () => {
        const workspaceData = await getCurrentWorkspace(workspaceId);

        if (!workspaceData) {
            return;
        }

        setCurrentWorkspace(workspaceData ?? null);
    };

    const fetchBoardData = async () => {
        const boardData = await getAllBoards(workspaceId);

        if (!boardData) {
            return;
        }

        setBoards(boardData ?? []);
    };

    useEffect(() => {
        if (!workspaceId) return;
        fetchWorkspaceData();
        fetchBoardData();
    }, [workspaceId]);

    const isAuthor = currentWorkspace?.authorId == session?.user.id;

    return ( 
        <div className="w-full shadow-2xl p-5 bg-blue-600 text-white grid grid-cols-3 grid-rows-1 ">
            <div className="flex justify-center items-center gap-5 rounded-md">
                <NavigationMenu className="text-neutral-600 bg-white rounded-md text-lg">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                        <NavigationMenuTrigger>Boards</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            {boards.length == 0 && (
                                <p className="text-neutral-500 text-sm">No boards</p>
                            )}
                            <div className="w-[400px]">
                                {boards.map((board) => (
                                    <div key={board.id} className="flex gap-5 items-center justify-between">
                                        <NavigationMenuLink href={`/dashboard/${currentWorkspace?.id}/board/${board.id}`} className="w-full">
                                            {board.title}
                                        </NavigationMenuLink>
                                        {isAuthor && (
                                            <DeleteConfirmModal boardId={board.id} onDeleteBoard={() => onDeleteBoard(board.id)} deleteText="board"/>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="text-neutral-600">+ Create board</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center">Create a new board</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={async (e) => {
                                e.preventDefault();
                                const title = new FormData(e.currentTarget);

                                try {
                                    await createBoard(currentWorkspace!.authorId, workspaceId, title)
                                    toast.success("Board created");
                                    setIsOpen(false);
                                    fetchBoardData();
                                } catch (error) {
                                    toast.error("Failed to create board");                                    
                                }
                            }}>
                            <Input required autoFocus name="board-title" maxLength={30} minLength={3}></Input>
                            <Button type="submit" className="w-full mt-5 bg-blue-500 hover:bg-blue-500/80 text-white">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex mx-auto bg-blue-300 px-4 py-2 shadow-2xl rounded-md gap-3 w-[50%]">
                <Image src="/workspace.png" width={30} height={30} alt="workspace"/>
                <p className="text-xl font-bold" >{currentWorkspace?.title}</p>
            </div>

            {isAuthor && (
                <div className="flex justify-center items-center gap-3 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-black">Manage Members</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-center">Manage workspace members</DialogTitle>
                            </DialogHeader>
                            <ManageMembers workspace={currentWorkspace ?? null}/>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}
 
export default WorkspaceNavbar;