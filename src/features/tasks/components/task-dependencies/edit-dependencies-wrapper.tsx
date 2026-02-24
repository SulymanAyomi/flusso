import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../../api/use-get-task";
import { useGetTasks } from "../../api/use-get-tasks";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskDependency } from "./edit-dependencies";
import { useGetTaskDependencies } from "../../api/use-get-tasks-dependencies";

interface TaskDependenciesWrapperProps {
  onCancel: () => void;
  id: string;
}

export const TaskDependenciesWrapper = ({
  onCancel,
  id,
}: TaskDependenciesWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { data, isLoading } = useGetTaskDependencies({
    taskId: id,
  });

  const otherTasks = data?.otherTasks.filter((t) => t.id != id);

  const initDep = data?.task.blockedBy.map((task) => task.dependsOnId);
  const name = data?.task.name!;
  // const isLoading = isLoadingTask || isLoadindTasks;
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }
  if (initDep) {
    console.log("iniitt", initDep, data);
  }

  return (
    <TaskDependency
      onCancel={onCancel}
      otherTasks={otherTasks ?? []}
      initDep={initDep ?? []}
      id={id}
      name={name}
    />
  );
};
