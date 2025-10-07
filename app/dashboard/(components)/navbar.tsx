"use client";

import { authClient, useSession } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Workspaces from "./workspaces";
import { useState } from "react";


const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
        return null;
    }

    const user = session.user;
    
    return ( 
        <nav className="grid grid-cols-3 grid-rows-1 w-full shadow-2xl p-5 bg-blue-600 text-white border-b-3">

            <div className="flex items-center justify-center gap-3">
                <Image src="/trelloicon.png" width={50} height={50} alt="logo"/>
                <h1 className="font-bold md:text-3xl text-xl">Trello</h1>
            </div>
            
            <Workspaces userId={user.id}/>

            <div className="flex items-center justify-center gap-3 h-full">
                <Avatar>
                    <AvatarImage src={user?.image ?? undefined} />
                    <AvatarFallback className="text-black bg-amber-300">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-sm">{user.name}</p>
                <Button className="cursor-pointer" onClick={async() => await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/")
                        }
                    }
                })}>Sign out</Button>
            </div>
        </nav>
    );
}
 
export default Navbar;