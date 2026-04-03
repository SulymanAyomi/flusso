import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetMemberProjects } from "@/features/members/api/use-get-single-project-member";
import { AssignMember } from "./assign-member";
import { useGetQuickProjects } from "../../api/use-get-quick-projects";
import { useGetProject } from "../../api/use-get-project";
import { useGetMembers } from "@/features/members/api/use-get-members";

interface AssignMemberWrapperProps {
  onCancel: () => void;
  id: string;
}

export const AssignMemberWrapper = ({
  onCancel,
  id,
}: AssignMemberWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProject({
    projectId: id,
  });

  const { data: member, isPending: isPendingMember } = useGetMembers({
    workspaceId,
  });

  const isLoading = isPending || isPendingMember;
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !member) {
    return null;
  }

  return <AssignMember onCancel={onCancel} members={member} project={data} />;
};
