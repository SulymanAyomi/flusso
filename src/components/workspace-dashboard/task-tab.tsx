import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceTasks } from "@/features/workspaces/api/use-get-workspace-tasks";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "@/features/tasks/components/task-actions";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";

const TaskTabs = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceTasks({ workspaceId });
  return (
    <Card className="min-h-[21px]">
      <Tabs defaultValue="all" className="w-full">
        <CardHeader>
          <div className="flex  justify-between items-center">
            <h3 className="text-[18px] font-semibold">My Tasks</h3>
            <TabsList className="w-fit bg-neutral-100 ">
              <TabsTrigger
                className="text-black data-[state=active]:bg-brand1 data-[state=active]:text-white"
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="text-black data-[state=active]:bg-brand1 data-[state=active]:text-white"
                value="today"
              >
                Today
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="today">
            <div className="flex gap-2 flex-col">
              {isLoading ? (
                <>
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                </>
              ) : data?.dueTodayTasks.count && data?.dueTodayTasks.count > 0 ? (
                data?.dueTodayTasks.tasks.map((task) => (
                  <div className="flex justify-between items-center p-2 rounded-md bg-neutral-100 overflow-auto">
                    <p className="text-xs">{task.name}</p>
                    <div className="flex items-center justify-center">
                      <Avatar className="size-5 hover:opacity-75 transition border border-neutral-300">
                        <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <MemberAvatar name={task.name} />
                    </div>
                    <Badge variant={task.status} className="text-xs">
                      {snakeCaseToTitleCase(task.status)}
                    </Badge>
                    <div>
                      <p className="text-xs line-clamp-1">
                        {format(task.dueDate!, "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant={task.priority} className="text-[10px]">
                      {snakeCaseToTitleCase(task.priority)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-center text-xs">No deadline today</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="all">
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                  <Skeleton className="bg-neutral-100 w-full h-7" />
                </>
              ) : data?.myAssignedTasks.count &&
                data?.myAssignedTasks.count > 0 ? (
                data?.myAssignedTasks.tasks.map((task) => (
                  <div className="flex justify-between items-center px-1 py-2 md:p-2 bg-white rounded-md border border-neutral-100 shadow-sm  text-sm text-gray-700">
                    <div className="w-1/4">
                      <p className="text-xs line-clamp-1">{task.name}</p>
                    </div>
                    <div className="w-1/4 flex items-start justify-start ">
                      <Badge
                        variant={task.status}
                        className="text-[10px] px-1 line-clamp-1 w-fit"
                      >
                        {snakeCaseToTitleCase(task.status)}
                      </Badge>
                    </div>
                    <div className="w-1/4">
                      <p className="text-xs line-clamp-1 ">
                        {format(task.dueDate!, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="w-1/4 flex items-start">
                      <Badge
                        variant={task.priority}
                        className="text-xs line-clamp-1 w-fit"
                      >
                        {snakeCaseToTitleCase(task.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-end">
                      <TaskActions id={task.id} projectId={task.project.id}>
                        <Button variant="ghost" size="xs">
                          <MoreVertical className="size-3" />
                        </Button>
                      </TaskActions>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-center text-xs">
                    You have not been assigned to a Task
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default TaskTabs;
