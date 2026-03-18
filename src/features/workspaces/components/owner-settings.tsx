import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwner } from "@/features/members/api/use-get-owner";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import React from "react";

interface OwnerSettingsProp {
  workspaceId: string;
  ownerId: string;
}
const OwnerSettings = ({ workspaceId, ownerId }: OwnerSettingsProp) => {
  const { data, isPending } = useOwner({ workspaceId, userId: ownerId });

  if (isPending) {
    return (
      <Card className="w-full h-full border-none shadow-none p-7">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }
  if (!data) {
    return (
      <Card className="w-full h-full border-none shadow-none p-7">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">Owner</h3>
          <div className="flex items-center gap-4  p-3 border rounded-md">
            <MemberAvatar
              className="size-10"
              fallbackClassName="text-lg"
              name={data.owner.user.name!}
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{"owner?.user.name"}</p>
              <p className="text-xs text-muted-foreground">
                {data.owner.user.email}
              </p>
            </div>
            <Badge variant="CRITICAL">Owner</Badge>
          </div>
          <Button
            className="mt-2 w-fit ml-auto"
            size="sm"
            variant="primary"
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
