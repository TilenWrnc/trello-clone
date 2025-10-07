import { getSingleBoard } from "@/prisma/boards";
import getAllCards from "@/prisma/cards";
import { Loader } from "lucide-react";
import Image from "next/image";
import CreateCard from "./(components)/create-card";
import Tasks from "./(components)/tasks";

interface BoardProps {
    params: {
        boardId: string;
    }
}

const Board = async({ params }: BoardProps) => {
    const { boardId }= await Promise.resolve(params);

    const board = await getSingleBoard(boardId);
    const cards = await getAllCards(boardId);

    if (!board && !cards) {
        return (
            <div className="flex justify-center mt-30">
                <Loader className="animate-spin"/> 
            </div>
        )
    }

    return ( 
        <div className="bg-gradient-to-br from-blue-300 via-purple-300 via-70% to-pink-400 min-h-screen text-4x">
            <div className="bg-blue-600/50 flex justify-center py-3 gap-5">
                <h1 className="text-white text-3xl font-bold flex gap-3 items-center">
                    <Image src="/board.png" width={30} height={30} alt="workspace"/>
                    <p>{board?.title}</p>
                </h1>
                <CreateCard boardId={boardId} authorId={board!.authorId}/>
            </div>
            {cards?.length === 0 && (
                <div className="bg-gradient-to-br min-h-screen text-4xl font-bold text-white/70 text-center pt-80">
                    Create a card to begin working!
                </div>
            )}
            <Tasks allCards={cards}/>  
        </div>
    );
}
 
export default Board;
