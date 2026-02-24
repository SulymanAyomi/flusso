import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { EditProjectForm } from "./edit-project-form";
import { useGetProject } from "../api/use-get-project";
import { useProjectId } from "../hooks/use-project-id";

interface EditProjectFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditProjectFormWrapper = ({
  onCancel,
  id,
}: EditProjectFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingProject } = useGetProject({
    projectId: id,
  });
  const { data: members, isLoading: isLoadindMembers } = useGetMembers({
    workspaceId,
  });

  const memberOptions = members?.populateMembers.map((member) => ({
    id: member.id,
    name: member.user.name,
  }));

  const isLoading = isLoadindMembers || isLoadingProject;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditProjectForm
      onCancel={onCancel}
      initialValues={initialValues}
      memberOptions={memberOptions ?? []}
    />
  );
};
