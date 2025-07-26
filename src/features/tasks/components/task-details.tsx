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
import { Task } from "../types";
import { Badge } from "@/components/ui/badge";
import { GetTaskResponseType } from "../api/use-get-task";
import { DottedSeparator } from "@/components/dotted-separator";
import { snakeCaseToTitleCase } from "@/lib/utils";

const TaskDetails = ({ task }: GetTaskResponseType["data"]) => {
  return (
    <div className="bg-white w-[500px] p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
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
            <p>Created time</p>
          </div>
          <div className="flex-1">
            <p className="text-black">
              {format(task.createdAt!, "MMMM d, yyyy")}{" "}
              <span className="text-neutral-400">
                {format(task.createdAt!, "p")}
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
            {/* <div className="p-1 px-2 bg-yellow-200 text-yellows-800 rounded-[12px] text-[10px]">
              In Progress
            </div> */}
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
            {/* <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
              Low
            </div> */}
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
            <p className="text-black"> {format(task.startDate!, "PPPP")}</p>
          </div>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center w-[25%] gap-1">
            <Calendar className="size-5 text-neutral-400" />
            <p>Due Date</p>
          </div>
          <div className="flex-1">
            <p className="text-black"> {format(task.dueDate!, "PPPP")}</p>
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
            <MemberAvatar name={task.assignedTo?.user.name!} />
          </div>
        </div>
        <div className="flex items-center w-full ">
          <div className="flex flex-col bg-blue-50 p-3 rounded-[12px] w-full">
            <p className="text-black font-semibold text-sm mb-2">Description</p>
            <p className="line-clamp-3 text-black">{task.description}</p>
          </div>
        </div>
        {/* */}

        <Tabs
          //   defaultValue={view}
          //   onValueChange={setView}
          className="flex-1 w-full border-t"
        >
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
              <div className="flex flex-1 flex-col p-4 text-black">
                <div>
                  <div className="mb-3">
                    <p>Today</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex items-center justify-center">
                        {/* <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar> */}
                        <MemberAvatar className="size-8" name="Baba" />
                      </div>
                      <div className="flex justify-start">
                        <div className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </div>
                        <div className="text-[10px]">May 30, 10:23pm</div>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex items-center justify-center">
                        {/* <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar> */}
                        <MemberAvatar
                          className="size-8 hover:opacity-75 transition border border-neutral-300"
                          name="Damilola"
                        />
                      </div>
                      <div className="flex justify-start">
                        <div className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </div>
                        <div className="text-[10px]">May 30, 10:23pm</div>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex items-center justify-center">
                        <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar>
                        {/* <MemberAvatar name="Damilola" /> */}
                      </div>
                      <div className="flex justify-start">
                        <div className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </div>
                        <div className="text-[10px]">May 30, 10:23pm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="subtasks">
              <div className="flex flex-1 flex-col p-4">
                <div>
                  <div className="flex gap-2  items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full">
                    <Checkbox /> <p>Inbox Template</p>
                  </div>
                  <div className="flex gap-2   items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full">
                    <Checkbox /> <p>Inbox Template</p>
                  </div>
                  <div className="flex gap-2   items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full">
                    <Checkbox /> <p>Inbox Template</p>
                  </div>
                  <div className="flex gap-2  items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full">
                    <Checkbox /> <p>Inbox Template</p>
                  </div>
                  <div className="flex gap-2 text-black items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full cursor-pointer">
                    <Plus /> <p className="text-black">Add Checklist Item</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comments">
              <div className="flex flex-1 gap-5 flex-col p-4 text-black">
                {/* <div className="flex flex-col relative">
                  <Textarea
                    placeholder="Add Comments"
                    className="text-[10px] min-h-[100px]"
                  />
                  <div className="absolute bottom-0 p-2 right-0 left-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <Button className="text-xs w-fit h-fit px-3 py-2 bg-blue-700 text-white bottom-0">
                          Comment
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileIcon className="size-4" />
                        <SmileIcon className="size-4" />
                        <ImageIcon className="size-4" />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col gap-4">
                  {/* comment lists */}
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-start items-start gap-2">
                      <div className="flex items-center justify-center">
                        {/* <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar> */}
                        <MemberAvatar name="Damilola" />
                      </div>
                      <div className="flex flex-col gap-1 justify-start">
                        <p className="text-black font-semibold">
                          John Obi{" "}
                          <span className="text-[10px] text-neutral-700">
                            1 day ago
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-start items-start gap-2">
                      <div className="flex items-center justify-center">
                        <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col gap-1 justify-start">
                        <p className="text-black font-semibold">
                          John Obi{" "}
                          <span className="text-[10px] text-neutral-300">
                            1 day ago
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-start items-start gap-2">
                      <div className="flex items-center justify-center">
                        <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                            A
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col gap-1 justify-start">
                        <p className="text-black font-semibold">
                          John Obi{" "}
                          <span className="text-[10px] text-neutral-300">
                            1 day ago
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-semibold">Damilola</span>{" "}
                          changed the status of task{" "}
                          <span className="font-semibold">"web design"</span>{" "}
                          from{" "}
                          <span className="font-semibold">in progress</span> to{" "}
                          <span className="font-semibold">complete</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskDetails;
