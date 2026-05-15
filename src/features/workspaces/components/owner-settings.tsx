import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwner } from "@/features/members/api/use-get-owner";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import React from "react";
import { useTransferWorkspaceModal } from "../hooks/use-transfer-workspace-modal";

interface OwnerSettingsProp {
  user: {
    name: string | null;
    email: string | null;
    imageUrl: string | null;
  };
  workspaceId: string;
}
const OwnerSettings = ({ user, workspaceId }: OwnerSettingsProp) => {
  const { open } = useTransferWorkspaceModal();
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">Owner</h3>
          <div className="flex items-center gap-4  p-3 border rounded-md">
            <MemberAvatar
              className="size-10"
              fallbackClassName="text-lg"
              name={user.name!}
              imageUrl={user.imageUrl}
              imgClassName="size-10"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="CRITICAL">Owner</Badge>
          </div>
          <Button
            onClick={() => open(workspaceId)}
            className="mt-2 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            // disabled={isDeletingWorkspace}
            // onClick={handleDelete}
          >
            Transfer ownership
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerSettings;
