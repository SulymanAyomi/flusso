import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";
import { useGetTasks } from "../../api/use-get-tasks";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { data: projects, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadindMembers } = useGetMembers({
    workspaceId,
  });
  const { data: tasks, isLoading: isLoadindTask } = useGetTasks({
    workspaceId,
    projectId,
  });

  const projectOptions = projects?.map((project) => ({
    id: project.id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.populateMembers.map((member) => ({
    id: member.id,
    name: member.user.name!,
  }));
  const taskOptions = tasks?.documents.map((task) => ({
    id: task.id,
    name: task.name,
  }));

  const isLoading = isLoadindMembers || isLoadingProject || isLoadindTask;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      taskOptions={taskOptions ?? []}
    />
  );
};
