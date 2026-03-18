import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../../api/use-get-task";
import TaskDetails from "./task-details";
import { Button } from "@/components/ui/button";

interface TaskDetailWrapperProps {
  onCancel: () => void;
  id: string;
}

export const TaskDetailWrapper = ({ onCancel, id }: TaskDetailWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const isLoading = isLoadingTask;
  if (isLoading) {
    return (
      <Card className="w-full  h-[400px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return (
      <Card className="w-full h-[400px] md:h-[714px] border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-6 max-w-md h-full">
          <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
            <h2 className="text-3xl font-semibold tracking-tight first-letter:capitalize">
              Task not found.
            </h2>
            <p className="text-muted-foreground text-sm">
              This task may have been deleted, moved or you might not have
              access to it.
            </p>
          </div>
          <Button
            className="gap-2 bg-gradient-to-r from-brand1 to-brand2 hover:opacity-90 transition-opacity"
            onClick={() => {}}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <TaskDetails task={initialValues.task} />;
};
