import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { format } from "date-fns";
import { WorkspaceType } from "../types";

interface WorkspaceInfoProp {
  workspace: WorkspaceType;
}
const WorkspaceInfo = ({ workspace }: WorkspaceInfoProp) => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">workspaceId</h3>
            <div className="flex items-center gap-x-2">
              <Input disabled value={workspace.id} />
              <Button
                className="size-12"
                variant="secondary"
                // onClick={handleCopyInviteLink}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-col justify-center gap-2">
              <h3 className="font-semibold text-sm">CreatedAt</h3>
              <p className="text-xs">
                {format(new Date(workspace.createdAt!), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center flex-col justify-center gap-2">
              <h3 className="font-semibold text-sm">Member</h3>
              <p className="text-xs">{workspace._count.members} </p>
            </div>
            <div className="flex items-center flex-col justify-center gap-2">
              <h3 className="font-semibold text-sm">Projects</h3>
              <p className="text-xs">{workspace._count.projects}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceInfo;
