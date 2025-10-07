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
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createTask } from "@/prisma/tasks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CreateTaskProps {
    cardId: string;
}

const CreateTask = ({ cardId } : CreateTaskProps) => {
    const { data: session } = useSession();
    const [open, setIsOpen] = useState(false);
    const [date, setDate] = React.useState<Date>()
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
    const router = useRouter();

    if (!session) {
        return;
    }

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className=" w-full">+</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create task</DialogTitle>
                </DialogHeader>
                <form onSubmit={async (e) => {
                        e.preventDefault();
                        const title = new FormData(e.currentTarget);

                        if (!date) {
                            toast.error("Please select a due date");
                            return;
                        }

                        try {
                            await createTask(session.user.id, cardId, title, priority, date!)
                            toast.success("Task created");
                            setIsOpen(false);
                            router.refresh();
                        } catch (err) {
                            toast.error("Failed to create task");
                        }
                    }}>
                    <div className="flex flex-col gap-y-2 items-center justify-center">
                        <Input required autoFocus name="task-title"></Input>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                data-empty={!date}
                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                >
                                <CalendarIcon />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} required/>
                            </PopoverContent>
                        </Popover>
                        <Select onValueChange={(val) => setPriority(val as "LOW" | "MEDIUM" | "HIGH")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full mt-5 bg-blue-500 hover:bg-blue-500/80 text-white">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
 
export default CreateTask;