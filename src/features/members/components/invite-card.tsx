import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useResetInviteCode } from "@/features/workspaces/api/use-rest-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { CopyIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface InviteCardProp {
  workspace: {
    id: string;
    name: string;
    createdAt: string;
    imageUrl: string;
    inviteCode: string;
    ownerId: string | null;
    updatedAt: string;
  };
  isOwner: boolean;
}
const InviteCard = ({ workspace, isOwner }: InviteCardProp) => {
  const router = useRouter();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive",
  );
  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      {
        param: { workspaceId: workspace.id },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${workspace.id}/join/${workspace.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to the clipboard"));
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ResetDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Invite Members</h3>
          <p className="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input disabled value={fullInviteLink} />
              <Button
                className="size-12"
                variant="secondary"
                onClick={handleCopyInviteLink}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>
          {isOwner && (
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isResettingInviteCode}
              onClick={handleReset}
            >
              {isResettingInviteCode ? (
                <>
                  <Loader2Icon /> Reseting...{" "}
                </>
              ) : (
                "Reset invite link"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
