import React from "react";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChevronRightIcon } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaceProjects } from "@/features/workspaces/api/use-get-workspace-projects";

const ProjectLists = () => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  if (isLoadingProjects) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-[18px] font-semibold">Recent Projects</h3>
            <Link
              href={`/workspaces/${workspaceId}/projects`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view all projects
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[90px] w-[95%] rounded-[12px]" />
          <Skeleton className="h-[90px] w-[95%] rounded-[12px]" />
          <Skeleton className="h-[90px] w-[95%] rounded-[12px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-[18px] font-semibold">Recent Projects</h3>
          <Link
            href={`/workspaces/${workspaceId}/projects`}
            className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
          >
            view all projects
            <span>
              <ChevronRightIcon className="size-3" />
            </span>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {projects?.length! > 0 ? (
          projects?.map((project) => (
            <div className="flex gap-2 flex-col border shadow-sm rounded-[12px] px-3 py-4 ">
              <div className="flex justify-between items-center gap-3">
                <div className="text-sm font-semibold">{project.name}</div>
                <div className="text-xs">
                  {project.stats.completionPercentage}%
                </div>
              </div>
              <div>
                <Progress
                  value={project.stats.completionPercentage}
                  color="#0EB97F"
                  className={cn(
                    project.stats.completionPercentage == 100 &&
                      "text-green-700"
                  )}
                ></Progress>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant={project.status}>
                  {snakeCaseToTitleCase(project.status)}
                </Badge>
                {project.stats.tasks.total > 0 ? (
                  <p className="text-[10px]">
                    {project.stats.tasks.completed}/{project.stats.tasks.total}{" "}
                    tasks completed
                  </p>
                ) : (
                  <p className="text-[10px]">
                    {project.stats.tasks.total} tasks{" "}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center my-auto flex flex-col items-center justify-center h-full w-full text-sm">
            <p>No project</p>
            <p>
              You can start by creating a project{" "}
              <span className="underline cursor-pointer" onClick={() => open()}>
                here
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectLists;
