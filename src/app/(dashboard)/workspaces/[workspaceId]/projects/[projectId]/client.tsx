"use client";
import { useState } from "react";
import Image from "next/image";
import { differenceInDays, format } from "date-fns";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/tasks-view/task-view-switcher";
import {
  ArrowUp,
  Calendar,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  Clock,
  File,
  Folder,
  HomeIcon,
  ImageIcon,
  Link2,
  Loader,
  MoreVerticalIcon,
  NotepadText,
  NotepadTextDashed,
  PencilIcon,
  PencilLineIcon,
  Plus,
  PlusCircle,
  Router,
  SmileIcon,
  Star,
  Table2Icon,
  TagIcon,
  UserCheck2Icon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import PageHeader from "@/components/page-header";
import { ProjectsStatus } from "@/features/projects/types";
import { useEditProjectModal } from "@/features/projects/hooks/use-edit-project-modal";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { snakeCaseToTitleCase } from "@/lib/utils";

export const ProjectIdClient = () => {
  const [remainingDays, setRemainingDays] = useState("");
  const today = new Date();
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ workspaceId });
  const { open } = useEditProjectModal();
  const isLoading = isLoadingProject || isLoadingAnalytics;
  const tagslist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message={"project not found"} />;
  }
  // if (project.endDate) {
  //   const today = new Date();
  //   const days = differenceInDays(project.endDate!, today);
  //   setRemainingDays(`${days} day(s) more`);
  // }
  const openEdit = () => open(project.id);

  return (
    <div>
      <PageHeader
        header={"Welcome, Ayomi"}
        subText={"Start to manage your projects and assigned tasks here"}
        button={true}
        buttonType={"project"}
      />
      <div className="flex gap-1 text-xs px-3 py-1">
        <Link href={`/workspaces/${workspaceId}`}>
          <div className="flex items-center text-neutral-500 text-xs">
            <span className="mr-1">
              <HomeIcon className="size-3" />
            </span>
            Dashboard
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <Link href={`/workspaces/${workspaceId}/projects`}>
          <div className="flex items-center text-neutral-500 text-xs">
            <span className="mr-1">
              <Folder className="size-3" />
            </span>
            Projects
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <div className="text-xs text-blue-700">Project</div>
      </div>
      <div className="px-3 my-2 w-full bg-white">
        <div className="flex items-baseline justify-start">
          <p className="text-2xl font-semibold line-clamp-1">{project.name}</p>
          <span className="ml-4 cursor-pointer" onClick={openEdit}>
            <PencilLineIcon className="size-4 text-neutral-500" />
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[12%] items-center justify-start">
              <Loader className="size-4 mr-2" />
              <p>Status</p>
            </div>
            <div className="flex">
              <Badge variant={project.status}>
                {snakeCaseToTitleCase(project.status)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[12%] items-center justify-start">
              <UserCheck2Icon className="size-4 mr-2" />
              <p>Assignees</p>
            </div>
            <TeamMembers teams={project.team} />
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[12%] items-center justify-start">
              <CalendarDaysIcon className="size-4 mr-2" />
              <p>Due Date</p>
            </div>
            <div className="flex  gap-1">
              <div className="text-black px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs">
                <p>
                  {format(project.startDate!, "MMM d, yyyy")} -{" "}
                  {format(project.endDate!, "MMM d, yyyy")} (
                  {differenceInDays(project.endDate!, today)} day(s) more)
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[12%] items-center justify-start">
              <TagIcon className="size-4 mr-2" />
              <p>Tags</p>
            </div>
            <div className="flex  gap-1">
              <Badge className="py-1 bg-yellow-100 text-yellow-700">
                UI design
              </Badge>
              <div className="py-1 text-xs font-semibold ml-2 cursor-pointer">
                Add more...
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-start justify-start">
            <div className="flex text-sm mr-8 items-center justify-start">
              <TagIcon className="size-4 mr-2" />
              <p>Description</p>
            </div>
            <div className="flex">
              <div className="text-sm">{project.description}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <TaskViewSwitcher hideProjectFilter={true} />
        <div className="grid grid-cols-3  px-3 mt-6">
          {/* kaban card */}
          <div className="bg-white p-2.5 mb-1.5 rounded-[12px] shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-x-2">
              <p className="text-sm line-clamp-2 font-semibold">Task Name</p>
              {/* <TaskActions id={task.$id} projectId={task.projectId}> */}
              <MoreVerticalIcon className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
              {/* </TaskActions> */}
            </div>
            {/* <DottedSeparator /> */}
            <div>
              <p className="line-clamp-2 text-xs text-gray-700">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                fugiat recusandae ducimus fuga soluta quo dolor debitis,
                consequatur mollitia autem voluptas odit delectus!
              </p>
            </div>
            <div className="flex items-center gap-x-1.5 justify-between text-xs text-gray-700">
              <p>Assignees:</p>
              <div className="flex flex-row-reverse">
                <Avatar className="ml-[-12px] size-6">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar className="ml-[-12px] size-6">
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <Avatar className="size-6">
                  <AvatarFallback>K</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center">
                <CalendarDaysIcon className="size-4 gap-1" />
                <p>02 Nov 2024</p>
              </div>
              <Badge className=" bg-blue-300 text-blue-900 text-[10px]">
                Low
              </Badge>
            </div>
            <Separator className="bg-black/30 m-1 mb-2" />
            <div className="flex items-center justify-between gap-1 text-xs text-gray-700">
              <div className="flex items-center gap-1">
                <NotepadText className="size-4 " />
                <p>12 Comments</p>
              </div>
              <div className="flex items-center">
                <Link2 className="size-4" />
                <p>12 Links</p>
              </div>
              <div className="flex items-center">
                <NotepadTextDashed className="size-4" />
                <p>0/3</p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex bg-black/50 justify-end p-4">
          {/* task details */}
          <div className="bg-white w-[500px] p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <XIcon className="size-[18-px] stroke-1 shrink-0 hover:opacity-75 transition" />
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                <MoreVerticalIcon className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
              </div>
            </div>
            <Separator className="bg-neutral-300" />
            <div>
              <p className="line-clamp-1 font-semibold text-lg ">
                Design Homepage Wireframe
              </p>
            </div>
            <div className="flex flex-col gap-4 text-neutral-400 text-xs pt-2">
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1">
                  <Clock className="size-5 text-neutral-400" />
                  <p>Created time</p>
                </div>
                <div className="flex-1">
                  <p className="text-black">
                    September 20, 2024{" "}
                    <span className="text-neutral-400">10:35 AM</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1">
                  <Loader className="size-5 text-neutral-400" />
                  <p>Status</p>
                </div>
                <div className="flex-1 flex items-center justify-start">
                  <div className="p-1 px-2 bg-yellow-200 text-yellows-800 rounded-[12px] text-[10px]">
                    In Progress
                  </div>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1">
                  <CheckCircle2Icon className="size-5 text-neutral-400" />
                  <p>Priority</p>
                </div>
                <div className="flex-1 flex items-center justify-start">
                  <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
                    Low
                  </div>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1">
                  <Calendar className="size-5 text-neutral-400" />
                  <p>Due Date</p>
                </div>
                <div className="flex-1">
                  <p className="text-black">September 20, 2024</p>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1">
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
                <div className="flex w-[25%] gap-1">
                  <UsersIcon className="size-5 text-neutral-400" />
                  <p>Assignees</p>
                </div>
                <div className="flex-1">
                  <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center w-full ">
                <div className="flex flex-col bg-blue-50 p-3 rounded-[12px]">
                  <p className="text-black font-semibold text-sm mb-2">
                    Description
                  </p>
                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Illum nobis suscipit in minus dolorum nulla sed. Qui aperiam
                    alias sequi. Recusandae, voluptas consequuntur.
                  </p>
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
                              <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
                                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                                  A
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex justify-start">
                              <div className="text-xs">
                                <span className="font-semibold">Damilola</span>{" "}
                                changed the status of task{" "}
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
                            </div>
                            <div className="flex justify-start">
                              <div className="text-xs">
                                <span className="font-semibold">Damilola</span>{" "}
                                changed the status of task{" "}
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
                            </div>
                            <div className="flex justify-start">
                              <div className="text-xs">
                                <span className="font-semibold">Damilola</span>{" "}
                                changed the status of task{" "}
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
                        <Plus />{" "}
                        <p className="text-black">Add Checklist Item</p>
                      </div>
                      <div className="flex flex-col gap-2 text-black items-start justify-start py-2 rounded-md hover:bg-primary-foreground w-full cursor-pointer">
                        <Input
                          placeholder="Add subtask "
                          className="h-6 bg-white border w-1/2 text-[10px] py-2 px-3 focus-visible:border"
                        />
                        <Button className="bg-blue-900 text-white py-1 px-4 text-xs h-fit rounded-md font-normal ">
                          Add
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="comments">
                    <div className="flex flex-1 gap-5 flex-col p-4 text-black">
                      <div className="flex flex-col relative">
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
                              <File className="size-4" />
                              <SmileIcon className="size-4" />
                              <ImageIcon className="size-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        {/* comment lists */}
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
                                <span className="text-[10px] text-neutral-700">
                                  1 day ago
                                </span>
                              </p>
                              <p className="text-xs">
                                <span className="font-semibold">Damilola</span>{" "}
                                changed the status of task{" "}
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
                                <span className="font-semibold">
                                  "web design"
                                </span>{" "}
                                from{" "}
                                <span className="font-semibold">
                                  in progress
                                </span>{" "}
                                to{" "}
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
        </div>
        <div className="ml-4 flex bg-black/50 justify-end p-4 mt-8">
          {/* task create */}
          {/* <CreateTaskForm /> */}
          <div className="bg-white p-2.5 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto w-[400px]">
            <div className="flex items-start justify-between gap-x-2">
              <p className="text-sm line-clamp-2 font-semibold">Select Tags</p>
              <div>
                <XIcon className="size-5" />
              </div>
            </div>
            {/* <DottedSeparator /> */}
            <div className="border rounded-md h-32">
              <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
                {tagslist.map((l, index) => (
                  <div
                    className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]"
                    key={index}
                  >
                    UI design
                  </div>
                ))}
                <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
                  UI design
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-1.5 justify-between text-xs text-gray-700 relative">
              <Input
                placeholder="Add new tag"
                className="w-full px-2 h-10 pr-[50px]"
              />
              <Button className="flex justify-center items-center absolute h-full right-0">
                <ArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamMembersProps {
  teams: {
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }[];
}
const TeamMembers = ({ teams }: TeamMembersProps) => (
  <div className="flex gap-1">
    {teams.map((team) =>
      team.id ? (
        <div
          className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold"
          key={team.id}
        >
          <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5 mr-1">
            {team.user.image ? (
              <Image src={team.user.image} alt={team.user.name![0]} />
            ) : (
              team.user.name![0]
            )}
          </div>
          <p>{team.user.name}</p>
        </div>
      ) : (
        <></>
      )
    )}
    <div className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Baba Tunde</p>
    </div>
    <div className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Tolu James</p>
    </div>
    <div className="bg-sky-100 px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Musa Ridwan</p>
    </div>
    <div className="cursor-pointer bg-sky-100 px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        <PlusCircle />
      </div>
      <p>Add Member</p>
    </div>
  </div>
);
