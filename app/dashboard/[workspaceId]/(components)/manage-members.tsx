"use client"

import { useSession } from "@/app/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import getUsers from "@/prisma/users";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { currentWorkspace } from "./workspace-navbar";
import { id } from "zod/v4/locales";
import { addUsersToWorkspace, removeUsersFromWorkspace } from "@/prisma/workspaces";
import { set } from "zod";

type User = {
    id: string,
    name: string,
    image: string | null,
    workspacesMember: {
        id: string;
    }[];
}

interface ManageMembersProps {
    workspace: currentWorkspace | null ;
}

const ManageMembers = ({ workspace }: ManageMembersProps) => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[] | null>(null)
    
    if (!session) {
        return;
    }
    
    useEffect(() => {
        const fecthUsers = async() => {
            try {
                const allUsers = await getUsers(session.user.id);
                setUsers(allUsers ?? []);
                console.log(users)
            } catch (error) {
                console.log(error)
            }
        }
        
        fecthUsers();
    }, [session.user.id])
    
    if (!users) {
        return (
            <Loader className="animate-spin m-auto my-5"/>
        )
    }

    async function handleAddAndRemoveUserToWorkspace(workspaceId: string, userId: string, method: string) {
        if (method === "add") {
            await addUsersToWorkspace(workspaceId, userId);
            setUsers((prevUsers) =>
                prevUsers?.map((user) =>
                user.id === userId ? {
                        ...user,
                        workspacesMember: [
                        ...user.workspacesMember,
                        { id: workspaceId }, 
                        ],
                    }
                    : user
                ) ?? []
            );
        } else {
            await removeUsersFromWorkspace(workspaceId, userId);
            setUsers((prevUsers) =>
                prevUsers?.map((user) =>
                user.id === userId ? {
                        ...user,
                        workspacesMember: user.workspacesMember.filter(ws => ws.id !== workspaceId)
                    }
                    : user
                ) ?? []
            );
        }
    }
    
    return ( 
        <div>
            {users?.map((user) => (
                <div key={user.id} className="flex my-2 justify-between items-center">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p>{user.name}</p>
                    </div>
                    {user.workspacesMember.some(ws => ws.id === workspace?.id) ? (
                        <Button size="sm" variant="destructive" onClick={() => handleAddAndRemoveUserToWorkspace(workspace!.id, user.id,"remove")}>Remove from Workspace</Button>
                    ): (
                        <Button size="sm" onClick={() => handleAddAndRemoveUserToWorkspace(workspace!.id, user.id, "add")}>Add to Workspace</Button>
                    )}
                </div>
            ))}
        </div>
    );
}
 
export default ManageMembers;