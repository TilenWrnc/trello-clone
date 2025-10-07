"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createWorkspace, { getAllWorkspaces, getOtherUserWorkspaces } from "@/prisma/workspaces";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "./delete-confirm-modal";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface WorkspacesProps {
    userId: string,
}

export type Workspace = {
  id: string;
  title: string;
  authorId: string;
};

type otherWorkspaces = {
    id: string;
    title: string;
    author: {
        name: string,
        image: string | null,
    }
}

const Workspaces = ({ userId }: WorkspacesProps) => {
    const router = useRouter();
    const [workspaces, setWorkspaces] = useState<Workspace[] | []>([]);
    const [otherWorkspaces, setOtherWorkspaces] = useState<otherWorkspaces[] | []>([]);
    const [isOpen, setIsOpen] = useState(false);

    function onDeleteWorkspace(workspaceId: string) {
        setWorkspaces(prev => prev.filter(workspace => workspace.id !== workspaceId));
        router.push("/dashboard");
    }
    
    useEffect(() => {
        (async () => {
            const userWorkspaceData = await getAllWorkspaces(userId);
            setWorkspaces(userWorkspaceData);
            const otherWorkspaceData = await getOtherUserWorkspaces(userId);
            setOtherWorkspaces(otherWorkspaceData);
        })();
    }, [userId]);

    return ( 
        <div className="flex items-center justify-center gap-3 text-neutral-600">
            <NavigationMenu className="bg-white rounded-md">
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger>Workspaces</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        {workspaces.length == 0  && otherWorkspaces.length == 0 ? (
                            <p className="text-neutral-500 text-sm">No workspaces</p>
                        ) : (
                            <div>
                                <div className="w-[400px]">
                                    <p className="text-center text-neutral-600 text-lg">Your workspaces</p>
                                    <Separator className="mb-2"/>
                                    {workspaces.map((workspace) => (
                                        <div className="flex gap-5 items-center justify-between" key={workspace.id}>
                                            <NavigationMenuLink href={`/dashboard/${workspace.id}`} className="w-full">
                                                {workspace.title}
                                            </NavigationMenuLink>
                                            <DeleteConfirmModal workspaceId={workspace.id}  onDeleteWorkspace={() => onDeleteWorkspace(workspace.id)} deleteText="workspace"/>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-[400px]">
                                    <p className="text-center text-neutral-600 text-lg">Other workspaces</p>
                                    <Separator className="mb-2"/>
                                    {otherWorkspaces.map((workspace) => (
                                        <div className="flex gap-5 items-center justify-between" key={workspace.id}>
                                            <NavigationMenuLink href={`/dashboard/${workspace.id}`} className="w-full">
                                                {workspace.title}
                                            </NavigationMenuLink>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Avatar>
                                                            <AvatarImage src={workspace.author?.image ?? undefined} />
                                                            <AvatarFallback className="text-black bg-amber-300">{workspace.author.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Author: {workspace.author.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="text-neutral-600">+ Create workspace</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Create a new workspace</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                            e.preventDefault();
                            const title = new FormData(e.currentTarget);
                            
                            try {
                                const newWorkspace = await createWorkspace(userId, title);
                                if (!newWorkspace) return;
                                setWorkspaces((prev) => [...prev, newWorkspace]);
                                toast.success("Workspace created");
                                setIsOpen(false);
                            } catch (err) {
                                toast.error("Failed to create workspace");
                            }
                        }}>
                        <Input required autoFocus name="workspace-title" maxLength={20} minLength={3}></Input>
                        <Button type="submit" className="w-full mt-5 bg-blue-500 hover:bg-blue-500/80 text-white">Create</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
 
export default Workspaces;