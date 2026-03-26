import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { differenceInDays, format } from "date-fns";
import {
  XIcon,
  Star,
  MoreVerticalIcon,
  Clock,
  Loader,
  CheckCircle2Icon,
  Calendar,
  TagIcon,
  UsersIcon,
  Plus,
  SmileIcon,
  ImageIcon,
  FileIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "react-day-picker";
import { Task } from "../../types";
import { Badge } from "@/components/ui/badge";
import { GetTaskResponseType } from "../../api/use-get-task";
import { DottedSeparator } from "@/components/dotted-separator";
import { snakeCaseToTitleCase } from "@/lib/utils";
import TaskActivities from "./task-activities";
import SubTasks from "./sub-tasks";
import TaskComments from "./task-comments";

const TaskDetails = ({ task }: GetTaskResponseType["data"]) => {
  return (
    <div className="bg-white w-full h-full p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2">
          {/* <Star className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" /> */}
          {/* <MoreVerticalIcon className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" /> */}
        </div>
      </div>
      {/* <Separator className="bg-neutral-300" /> */}
      <div>
        <p className="line-clamp-1 font-semibold text-lg ">{task.name}</p>
      </div>
      <div className="flex flex-col gap-4 text-neutral-400 text-xs pt-2">
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <Clock className="size-5 text-neutral-400" />
            <p>Created date</p>
          </div>
          <div className="flex-1">
            <p className="text-black">
              {format(new Date(task.createdAt!), "MMMM d, yyyy")}{" "}
              <span className="text-neutral-400">
                {format(new Date(task.createdAt!), "p")}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <Loader className="size-5 text-neutral-400" />
            <p>Status</p>
          </div>
          <div className="flex-1 flex items-center justify-start">
            <Badge
              className="text-[10px] py-1 px-2 rounded-[12px]"
              variant={task.status}
            >
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <CheckCircle2Icon className="size-5 text-neutral-400" />
            <p>Priority</p>
          </div>
          <div className="flex-1 flex items-center justify-start">
            <Badge
              className="text-[10px] py-1 px-2 rounded-[12px]"
              variant={task.priority}
            >
              {snakeCaseToTitleCase(task.priority)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <Calendar className="size-5 text-neutral-400" />
            <p>Start Date</p>
          </div>
          <div className="flex-1">
            <p className="text-black">
              {" "}
              {format(new Date(task.startDate!), "PPPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <Calendar className="size-5 text-neutral-400" />
            <p>Due Date</p>
          </div>
          <div className="flex-1">
            <p className="text-black">
              {" "}
              {format(new Date(task.dueDate!), "PPPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <TagIcon className="size-5 text-neutral-400" />
            <p>Tags</p>
          </div>
          <div className="flex-1 flex items-center justify-items-start">
            <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
              UI design
            </div>
          </div>
        </div>
        <div className="flex items-center w-full ">
          <div className="flex items-center w-[25%] gap-1">
            <UsersIcon className="size-5 text-neutral-400" />
            <p>Assignees</p>
          </div>
          <div className="flex-1">
            {task.assignedTo ? (
              <MemberAvatar
                name={task.assignedTo?.user.name!}
                imageUrl={task.assignedTo?.user.imageUrl}
                fallbackClassName="bg-blue-500 text-white"
              />
            ) : (
              "unassigned"
            )}
          </div>
        </div>
        <div className="flex items-center w-full ">
          <div className="flex flex-col bg-blue-50 p-3 rounded-[12px] w-full">
            <p className="text-black font-semibold text-sm mb-2">Description</p>
            <p className="line-clamp-3 text-black">{task.description}</p>
          </div>
        </div>
        {/* */}

        <Tabs defaultValue="activity" className="flex-1 w-full border-t">
          <div className="h-full flex flex-col overflow-auto">
            <div className="border-b px-4">
              <TabsList className="w-full lg:w-fit bg-white pb-0  gap-4 justify-start">
                <TabsTrigger
                  className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black  rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
                  value="activity"
                >
                  <div className="flex items-center justify-start">
                    <p>Activities</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit  data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
                  value="subtasks"
                >
                  <div className="flex items-center justify-start">
                    <p>Subtasks</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
                  value="comments"
                >
                  <div className="flex items-center justify-start">
                    <p>Comments</p>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="activity">
              <TaskActivities taskId={task.id} />
            </TabsContent>
            <TabsContent value="subtasks">
              <SubTasks taskId={task.id} />
            </TabsContent>
            <TabsContent value="comments">
              <TaskComments taskId={task.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskDetails;
