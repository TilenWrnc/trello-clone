"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CreateTask from "./create-task";
import { useEffect, useState } from "react";
import { toggleCompleteTask, updateTasks } from "@/prisma/tasks";
import DeleteConfirmModal from "@/app/dashboard/(components)/delete-confirm-modal";
import { useSession } from "@/app/lib/auth-client";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";

type Task = {
  id: string;
  title: string;
  authorId: string;
  cardId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date;
  completed: boolean;
};

type Card = {
  id: string;
  title: string;
  authorId: string;
  boardId: string;
  tasks: Task[];
};

type Cards = Card[] | undefined;

interface TasksProps {
    allCards: Cards
}

const Tasks = ({ allCards }: TasksProps) => {
  const [cards, setCards] = useState<Card[]>(allCards ?? [])
  const { data: session } = useSession();
  
  useEffect(() => {
    setCards(allCards ?? []);
  }, [allCards]);
  
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    
    let updatedCards: Card[] = [];
    
    setCards((prevCards) => {
      const newCards = prevCards.map(card => ({ ...card, tasks: [...card.tasks] }));
      const sourceCard = newCards.find(c => c.id === source.droppableId);
      const destCard = newCards.find(c => c.id === destination.droppableId);
      if (!sourceCard || !destCard) return prevCards;
      
      const [movedTask] = sourceCard.tasks.splice(source.index, 1);
      destCard.tasks.splice(destination.index, 0, movedTask);
      
      updatedCards = newCards; 
      return newCards;
    });
    
    
    const sourceCard = updatedCards.find(c => c.id === source.droppableId);
    const destCard = updatedCards.find(c => c.id === destination.droppableId);
    if (!sourceCard || !destCard) return;
    
    for (let i = 0; i < destCard.tasks.length; i++) {
      await updateTasks(destCard.tasks[i].id, destCard.id, i);
    }
    
    if (sourceCard.id !== destCard.id) {
      for (let i = 0; i < sourceCard.tasks.length; i++) {
        await updateTasks(sourceCard.tasks[i].id, sourceCard.id, i);
      }
    }
  };
  
  function onDeleteCard(cardId: string) {
    setCards(prev => prev.filter(card => card.id !== cardId))
  };
  
  function onDeleteTask(taskId: string, cardId: string) {
    setCards(prevCards =>
      prevCards.map(card => 
        card.id === cardId
          ? { ...card, tasks: card.tasks.filter(task => task.id !== taskId) }
          : card
      )
    )
  };
  
  async function handleToggleComplete(taskId: string, cardId: string) {
    await toggleCompleteTask(taskId);
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId
        ? {
          ...card,
          tasks: card.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
        : card
      )
    )
  };
  
    return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 m-10 gap-5 auto-rows-min grid-flow-row-dense">
        {cards.map((card) => (
          <Card key={card.id} className="bg-gray-100 shadow-2xl rounded-md">
            <CardHeader>
              <CardTitle className="text-xl uppercase">{card.title}</CardTitle>
              {card.authorId == session?.user.id && (
                <CardAction>
                  <DeleteConfirmModal cardId={card.id}  onDeleteCard={() => onDeleteCard(card.id)} deleteText="card"/>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <CreateTask cardId={card.id}/>
              <Droppable droppableId={card.id}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[50px]"
                  >
                    {card.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex border bg-white text-black p-3 mb-2 rounded-xl shadow-xl justify-between"
                          >
                            <div className="flex gap-2 items-center">
                                {task.priority === "LOW" ? (
                                  <div className="w-[30px] h-[30px] rounded-xl shadow-2xl bg-green-300"></div>
                                ) : task.priority === "MEDIUM" ? (
                                  <div className="w-[30px] h-[30px] rounded-xl shadow-2xl bg-yellow-300"></div>
                                ) : (
                                  <div className="w-[30px] h-[30px] rounded-xl shadow-2xl bg-red-300"></div>
                                )}
                              <p className={task.completed ? "text-neutral-400 line-through" : ""}>{task.title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className={task.completed ? "text-neutral-400 line-through" : "text-neutral-600"}>{format(new Date(task.dueDate), "MM/dd/yyyy")}</p>
                               <NavigationMenu className="text-neutral-600 bg-white rounded-md text-lg" >
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                    <NavigationMenuTrigger><Ellipsis /></NavigationMenuTrigger>
                                    <NavigationMenuContent className="flex flex-col gap-y-2">
                                      <DeleteConfirmModal taskId={task.id} onDeleteTask={() => onDeleteTask(task.id, card.id)} deleteText="task"/>
                                      <Button variant="outline" size="sm" onClick={() => handleToggleComplete(task.id, card.id)}>
                                        {!task.completed ? "Complete" : "Uncomplete"}
                                      </Button>
                                    </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                              </NavigationMenu>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
};
 
export default Tasks;