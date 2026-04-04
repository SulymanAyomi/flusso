import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { MemberProfile } from "./member-profile";
import { useGetMember } from "../../api/use-get-member";

interface MemberProfileWrapperProps {
  onCancel: () => void;
  id: string;
}

export const MemberProfileWrapper = ({
  onCancel,
  id,
}: MemberProfileWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: member, isPending: isPendingMember } = useGetMember({
    workspaceId,
    memberId: id,
  });

  const isLoading = isPendingMember;
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!member) {
    return <p className="text-muted-foreground text-sm">Error!</p>;
  }

  return <MemberProfile onCancel={onCancel} data={member} />;
};
