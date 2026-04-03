import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetMemberProjects } from "@/features/members/api/use-get-single-project-member";
import { AssignProjectMember } from "./assign-member";
import { useGetQuickProjects } from "../../api/use-get-quick-projects";

interface AssignProjectMemberWrapperProps {
  onCancel: () => void;
  id: string;
}

export const AssignProjectMemberWrapper = ({
  onCancel,
  id,
}: AssignProjectMemberWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data, isPending: isMemberPending } = useGetMemberProjects({
    memberId: id,
    workspaceId,
  });
  const { data: projects, isPending: isProjectsPending } = useGetQuickProjects({
    workspaceId,
  });

  const isLoading = isMemberPending || isProjectsPending;
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

  return (
    <AssignProjectMember
      onCancel={onCancel}
      member={data.member}
      projects={projects}
    />
  );
};
