"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import {
  CheckIcon,
  ChevronRightIcon,
  FlagIcon,
  MoreVerticalIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ProjectType } from "@/features/projects/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  AllProjectsResponseType,
  useGetProjects,
} from "@/features/projects/api/use-get-projects";
import { format } from "date-fns";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent } from "../ui/tabs";
import { useQueryState } from "nuqs";
import { Skeleton } from "../ui/skeleton";
import { ProjectActions } from "./project-action";
import { Button } from "../ui/button";
import { DottedSeparator } from "../dotted-separator";
import { cn } from "@/lib/utils";
import { DataFilters } from "./data-filters";
import { useProjectsFilters } from "@/features/projects/hooks/use-project-filters";

interface ProjectCardProp {
  view: string;
  showFilter: boolean;
  search: string;
}
function ProjectCard({ view, showFilter, search }: ProjectCardProp) {
  const workspaceId = useWorkspaceId();
  const [{ status, assigneeId, dueDate }] = useProjectsFilters();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
    status,
    assigneeId,
    dueDate,
    search,
  });

  const [views, setView] = useState("table");

  useEffect(() => {
    setView(view);
  }, [view]);

  return (
    <div className="bg-white p-2 shadow-sm rounded-md">
      {/* <Tabs
        defaultValue={views}
        onValueChange={setView}
        className="flex-1 w-full"
      > */}
      {showFilter && (
        <div
          className={cn(
            "transition-all duration-1000 ease-in-out opacity-0 -translate-y-2",
            showFilter && "opacity-100 translate-y-0  "
          )}
        >
          <DottedSeparator className="my-4" />
          <DataFilters />
          <DottedSeparator className="my-4" />
        </div>
      )}
      <TabsContent value="table" className="mt-0">
        <DataTable
          columns={columns}
          data={projects ?? []}
          isLoadingProjects={isLoadingProjects}
        />
      </TabsContent>
      <TabsContent value="grid" className="mt-0">
        {isLoadingProjects ? (
          <ProjectGridSkeleton />
        ) : (
          <ProjectGrid projects={projects ?? []} />
        )}
      </TabsContent>
      {/* </Tabs> */}
    </div>
  );
}

export default ProjectCard;

interface ProjectsType {
  projects: AllProjectsResponseType["data"];
}

const ProjectGrid = ({ projects }: ProjectsType) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="grid grid-cols-3 py-2 gap-2">
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card className="px-3 flex flex-col gap-6 py-6 shadow-sm">
            <div className="flex gap-1 flex-col">
              <div className="flex justify-between items-center w-full">
                <p className="line-clamp-1 capitalize font-semibold">
                  {project.name}
                </p>
                <div className="cursor-pointer">
                  <ProjectActions id={project.id}>
                    <Button variant="ghost">
                      <MoreVerticalIcon className="size-5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                    </Button>
                  </ProjectActions>
                </div>
              </div>
              <div className="flex gap-1 overflow-hidden">
                <Badge
                  variant="default"
                  className="bg-green-200 text-green-800 hover:bg-green-200/80 hover:text-green-800 p-1 text-[8px]"
                >
                  Ui design
                </Badge>
              </div>
            </div>
            <div className="flex items-center  border-y py-2">
              <div className="w-[33.3333%] flex flex-col  items-center justify-center flex-1/3">
                <div className="flex items-center">
                  <span className="mr-1">
                    <CheckIcon className="size-3 text-green-700" />
                  </span>
                  <p>{project.counts.completed}</p>
                </div>
                <p className="text-xs">Completed</p>
              </div>
              <div className="w-[33.3333%] flex flex-col items-center justify-center border-x flex-1/3">
                <div className="flex items-center">
                  <span className="mr-1">
                    <FlagIcon className="size-3 text-blue-700" />
                  </span>
                  <p>{project.counts.In_progress}</p>
                </div>
                <p className="text-xs">In progress</p>
              </div>
              <div className="w-[33.3333%] flex flex-col items-center justify-center flex-1/3">
                <div className="flex items-center">
                  <span className="mr-1">
                    <XIcon className="size-3 text-red-700" />
                  </span>
                  <p>{project.counts.overdue}</p>
                </div>
                <p className="text-xs">Overdue</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex items-center justify-between w-full">
                <div className="text-[10px] flex ">
                  <p>Progress: </p>{" "}
                  <span className="font-semibold">
                    {project.percentage.toFixed(0)}%
                  </span>
                </div>
                <div
                  className={cn(
                    "text-[10px] flex",
                    project.percentage == 100 && "text-green-700"
                  )}
                >
                  <p>Completed: </p>
                  <span> {format(project.endDate!, "PP")}</span>
                </div>
              </div>
              <div className="flex w-full">
                <Progress
                  value={project.percentage}
                  className="bg-neutral-400 text-blue-500"
                ></Progress>
              </div>
            </div>
            <div className="flex justify-between items-center w-full mt-1.5">
              <div className="flex flex-row-reverse">
                <Avatar className="size-7 hover:opacity-75 transition border border-neutral-300 ml-[-10px]">
                  <AvatarFallback className="bg-blue-600 text-sm font-medium text-blue-100 flex items-center justify-center">
                    C
                  </AvatarFallback>
                </Avatar>
                <Avatar className="size-7 hover:opacity-75 transition border border-neutral-300 ml-[-10px]">
                  <AvatarFallback className="bg-blue-600 text-sm font-medium text-blue-100 flex items-center justify-center">
                    A
                  </AvatarFallback>
                </Avatar>
                <Avatar className="size-7 hover:opacity-75 transition border border-neutral-300">
                  <AvatarFallback className="bg-blue-600 text-sm font-medium text-blue-100 flex items-center justify-center">
                    +2
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-[10px] flex items-center hover:underline hover:cursor-pointer">
                <Link
                  href={`/workspaces/${workspaceId}/projects/${project.id}`}
                >
                  view projects
                </Link>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div>
          <p>No project</p>
        </div>
      )}
    </div>
  );
};

const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-3 py-2 gap-2">
    <Card className="px-3 flex flex-col gap-3 py-6 shadow-sm">
      <div className="flex gap-1 flex-col">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="flex items-center">
        <Skeleton className="w-full h-20" />
      </div>

      <div className="flex flex-col items-center justify-start w-full">
        <Skeleton className="w-full h-4" />
      </div>
      <div className="flex justify-between items-center w-full mt-1.5">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
    </Card>
    <Card className="px-3 flex flex-col gap-3 py-6 shadow-sm">
      <div className="flex gap-1 flex-col">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="flex items-center">
        <Skeleton className="w-full h-20" />
      </div>

      <div className="flex flex-col items-center justify-start w-full">
        <Skeleton className="w-full h-4" />
      </div>
      <div className="flex justify-between items-center w-full mt-1.5">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
    </Card>
    <Card className="px-3 flex flex-col gap-3 py-6 shadow-sm">
      <div className="flex gap-1 flex-col">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="flex items-center">
        <Skeleton className="w-full h-20" />
      </div>

      <div className="flex flex-col items-center justify-start w-full">
        <Skeleton className="w-full h-4" />
      </div>
      <div className="flex justify-between items-center w-full mt-1.5">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
    </Card>
  </div>
);
