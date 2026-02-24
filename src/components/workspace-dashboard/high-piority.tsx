import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useGetWorkspaceTasks } from "@/features/workspaces/api/use-get-workspace-tasks";
import { Skeleton } from "../ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Badge } from "../ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { format } from "date-fns";

const HighPiority = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceTasks({ workspaceId });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3>Highest priority</h3>
        </CardHeader>
        <CardContent className="flex gap-2 flex-col">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-5 w-9" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-5 w-9" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-5 w-9" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-5 w-9" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-[18px] font-semibold">Highest priority</h3>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {data?.dueTodayTasks.count && data?.dueTodayTasks.count > 0 ? (
          <div className="flex justify-between items-center">
            <div className="text-xs">Today's task</div>
            <div className="text-[8px] bg-blue-700 rounded-[12px] py-1 px-2 text-blue-200">
              Overdue
            </div>
            <Badge variant={"ACTIVE"}>Overdue</Badge>
          </div>
        ) : null}

        {data?.highPriorityTasks?.count &&
        data?.highPriorityTasks?.count > 0 ? (
          data?.highPriorityTasks.tasks?.map((task) => (
            <div className="flex justify-start items-center p-2 bg-white rounded-md border border-neutral-100 shadow-sm  text-sm text-gray-700">
              <p className="text-xs w-1/5">{task.name}</p>
              <div className="w-1/5 flex items-center justify-center">
                <MemberAvatar name={task.name} />
              </div>
              <div className="w-1/5">
                <Badge variant={task.status} className="text-[10px] px-1">
                  {snakeCaseToTitleCase(task.status)}
                </Badge>
              </div>
              <p className="text-xs w-1/5">
                {format(task.dueDate!, "MMM d, yyyy")}
              </p>
              <div className="w-1/5">
                <Badge variant={task.priority} className="text-xs">
                  {snakeCaseToTitleCase(task.priority)}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-center">No high piority task</div>
        )}
      </CardContent>
    </Card>
  );
};

export default HighPiority;
