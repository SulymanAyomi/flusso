"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { WorkspaceType } from "../../types";
import { Loader2Icon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { useTransferWorkspace } from "../../api/use-transfer-workspace";

interface TransferWorkspaceProps {
  onCancel?: () => void;
  memberOptions: { id: string; name: string }[];
  workspace: WorkspaceType;
}

export const TransferWorkspaceForm = ({
  onCancel,
  memberOptions,
  workspace,
}: TransferWorkspaceProps) => {
  const [newOwnerId, setNewOwnerId] = useState("");
  const [error, setError] = useState("");
  const members = memberOptions.filter(
    (member) => member.id !== workspace.ownerId,
  );
  const [ConfirmDialog, confirm] = useConfirm(
    "Confirm Ownership Transfer",
    "This action is irreversible. You will lose full control of this workspace, including managing members, settings, and billing.",
    "destructive",
  );

  const { mutate, isPending } = useTransferWorkspace();
  const onHandleClick = async () => {
    setError("");
    if (!newOwnerId) {
      setError("Select one of the members");
      return;
    }
    const ok = await confirm();
    if (!ok) return;
    mutate(
      {
        param: {
          workspaceId: workspace.id,
        },
        json: {
          newOwnerId,
        },
      },
      {
        onSuccess: () => {
          onCancel?.();
        },
        onError(error) {
          setError(error.message);
        },
      },
    );
  };
  return (
    <Card className="w-full h-full p-2.5 px-3 border-none shadow-none">
      <ConfirmDialog />
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <p className="text-xl font-bold">Transfer Workspace Ownership</p>
        </div>
      </div>
      <div className="mt-3 mb-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-0">
        <div>
          <div className="flex gap-1 flex-col items-start justify-between gap-x-2 px-3">
            <p className="mb-1 font-semibold">{workspace.name}</p>
            <p className="text-xs">
              Select a member to become the new workspace owner.
            </p>
            {error && <p className="text-[10px] text-red-500">{error}</p>}
          </div>
          <div className="px-3 w-full space-y-4">
            <div className="flex gap-4 text-neutral-400 text-xs pt-2">
              <Select
                defaultValue={newOwnerId}
                onValueChange={(id) => setNewOwnerId(id)}
              >
                <div className="flex-1 text-sm">
                  <div className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select new owner" />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-x-2">
                          <MemberAvatar className="size-6" name={member.name} />
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </div>
              </Select>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button variant="outline" onClick={onCancel} type="button">
                Cancle
              </Button>
              <Button
                variant="destructive"
                onClick={onHandleClick}
                disabled={isPending}
              >
                {isPending && (
                  <span>
                    <Loader2Icon className="animate-spin h-full" />
                  </span>
                )}
                Transfer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
