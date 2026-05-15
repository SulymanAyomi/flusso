import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Loader } from "lucide-react";
import { TransferWorkspaceForm } from "./transfer-workspace";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetWorkspace } from "../../api/use-get-workspace";

interface TransferWorkspaceProps {
  onCancel: () => void;
  id: string;
}

export const TransferWorkspaceWrapper = ({
  onCancel,
  id,
}: TransferWorkspaceProps) => {
  const projectId = useProjectId();

  const { data, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId: id,
  });
  const { data: members, isLoading: isLoadindMembers } = useGetMembers({
    workspaceId: id,
  });

  const memberOptions = members?.populateMembers.map((member) => ({
    id: member.id,
    name: member.user.name!,
  }));

  const isLoading = isLoadindMembers || isLoadingWorkspace;
  if (isLoading) {
    return (
      <Card className="w-full h-[200px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !members) {
    return (
      <Card className="w-full h-[200px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Workspace not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TransferWorkspaceForm
      onCancel={onCancel}
      memberOptions={memberOptions ?? []}
      workspace={data}
    />
  );
};
