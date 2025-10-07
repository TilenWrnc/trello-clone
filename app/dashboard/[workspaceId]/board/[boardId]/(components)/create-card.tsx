"use client";

import { useSession } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createCard, getCardsLength } from "@/prisma/cards";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCardProps {
    boardId: string,
    authorId: string;
}

const CreateCard = ({ boardId, authorId }: CreateCardProps) => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    if (!session) {
        return;
    }

    return ( 
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg">+ Create a card</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create a new card</DialogTitle>
                </DialogHeader>
                <form onSubmit={async (e) => {
                        e.preventDefault();
                        const title = new FormData(e.currentTarget);

                        const cardLength = await getCardsLength(session.user.id);

                        if (cardLength! >= 8) {
                            toast.error("Cannot have more than 8 cards!")
                            return;
                        }
                        
                        try {
                            await createCard(authorId, boardId ,title);
                            toast.success("Card created");
                            setIsOpen(false);
                            router.refresh();
                        } catch (err) {
                            toast.error("Failed to create card");
                        }
                    }}>
                    <Input required autoFocus name="card-title"></Input>
                    <Button type="submit" className="w-full mt-5 bg-blue-500 hover:bg-blue-500/80 text-white">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
 
export default CreateCard;