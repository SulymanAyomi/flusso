import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../../api/use-get-task";
import { useGetTasks } from "../../api/use-get-tasks";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskDependency } from "./edit-dependencies";

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

  const { data: tasks, isLoading: isLoadindTasks } = useGetTasks({
    workspaceId,
    projectId,
  });
  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const taskOptions = tasks?.documents
    .filter((task) => task.id !== id)
    .map((task) => ({
      id: task.id,
      name: task.name,
    }));

  const initDep = initialValues?.task.blockedBy.map((task) => task.dependsOnId);
  const isLoading = isLoadingTask || isLoadindTasks;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }
  if (initDep) {
    console.log("iniitt", initDep, initialValues);
  }

  return (
    <TaskDependency
      onCancel={onCancel}
      taskOptions={taskOptions ?? []}
      initDep={initDep ?? []}
      id={id}
    />
  );
};
