"use client";
import { CopyIcon, Loader2Icon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useGetWorkspace } from "../api/use-get-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import InviteCard from "@/features/members/components/invite-card";
import SettingsWorkspace from "./settings-workspace";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Badge } from "@/components/ui/badge";
import OwnerSettings from "./owner-settings";

export const EditWorkspaceForm = ({}) => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isPending: isPendingWorkspace } = useGetWorkspace({
    workspaceId,
  });
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive",
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    );
  };

  if (isPendingWorkspace) {
    <div className="h-[calc(100vh-190px)] flex items-center justify-center">
      <Loader2Icon className="size-9 animate-spin text-blue-400" />
    </div>;
  }
  if (!workspace) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto">
      <DeleteDialog />
      <div className="w-full h-full border-none shadow-none space-y-4 my-4">
        <SettingsWorkspace workspace={workspace} />
        <InviteCard workspace={workspace} />
        <OwnerSettings
          workspaceId={workspace.id}
          ownerId={workspace.ownerId!}
        />

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
                    {format(workspace.createdAt!, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center flex-col justify-center gap-2">
                  <h3 className="font-semibold text-sm">Member</h3>
                  <p className="text-xs">{2} </p>
                </div>
                <div className="flex items-center flex-col justify-center gap-2">
                  <h3 className="font-semibold text-sm">Projects</h3>
                  <p className="text-xs">{3}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting workspace is a irreversible operation and will remove
                all associated data
              </p>
              <Separator className="my-2" />

              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isDeletingWorkspace}
                onClick={handleDelete}
              >
                Delete workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
