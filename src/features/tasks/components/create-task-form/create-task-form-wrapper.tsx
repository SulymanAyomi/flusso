import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";
import { useGetTasks } from "../../api/use-get-tasks";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProfile } from "@/features/auth/api/use-get-profile";

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
  const { data: profile, isPending } = useGetProfile();

  const projectOptions = projects?.map((project) => ({
    id: project.id,
    name: project.name,
    imageUrl: project.imageUrl,
    startDate: project.startDate,
    endDate: project.endDate,
  }));

  const memberOptions = members?.populateMembers.map((member) => ({
    id: member.id,
    name: member.user.name!,
    img: member.user.imageUrl,
  }));
  const taskOptions = projectId
    ? tasks?.documents.map((task) => ({
        id: task.id,
        name: task.name,
      }))
    : undefined;

  const cUser = members?.populateMembers?.find(
    (m) =>
      m.user.name == profile?.user.name && m.user.email == profile?.user.email,
  );
  const currentUser = memberOptions?.find((m) => m.id == cUser?.id)?.id;

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
      currentUser={currentUser}
    />
  );
};
