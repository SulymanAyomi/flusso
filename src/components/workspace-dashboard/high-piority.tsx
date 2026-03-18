import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useGetWorkspaceTasks } from "@/features/workspaces/api/use-get-workspace-tasks";
import { Skeleton } from "../ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Badge } from "../ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { TaskActions } from "@/features/tasks/components/task-actions";
import { useRouter } from "next/navigation";

const HighPiority = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaceTasks({ workspaceId });

  const myTodayRoute = () => {
    router.push(`/workspaces/${workspaceId}/tasks`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-[18px] font-semibold">Workspace urgent tasks</h3>
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
    <Card className="flex min-h-60 flex-col">
      <CardHeader>
        <h3 className="text-[18px] font-semibold">Workspace urgent tasks</h3>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col h-full">
        {/* {data?.dueTodayTasks.count && data?.dueTodayTasks.count > 0 ? (
          <div
            className="flex justify-start items-center p-2 bg-white rounded-md border border-neutral-100 shadow-sm  text-sm text-gray-700 cursor-pointer"
            onClick={myTodayRoute}
          >
            <p className="text-xs w-1/3 line-clamp-1">My Today's tasks</p>
            <p className="text-xs w-1/5 line-clamp-1">
              {data?.dueTodayTasks.count}
            </p>
            <div className="w-1/5">
              <Badge variant="IN_REVIEW" className="text-[10px] px-1">
                Overdue
              </Badge>
            </div>
          </div>
        ) : null} */}

        {data?.highPriorityTasks?.count &&
        data?.highPriorityTasks?.count > 0 ? (
          data?.highPriorityTasks.tasks?.map((task) => (
            <div className="flex justify-start items-center p-2 bg-white rounded-md border border-neutral-100 shadow-sm  text-sm text-gray-700">
              <p className="text-xs w-1/5 line-clamp-1">{task.name}</p>
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
              <TaskActions id={task.id} projectId={task.project.id}>
                <Button variant="ghost" size="xs">
                  <MoreVertical className="size-3" />
                </Button>
              </TaskActions>
            </div>
          ))
        ) : (
          <div className="text-center my-auto flex flex-col items-center justify-center h-full w-full text-sm">
            <p>No high priority task.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HighPiority;
