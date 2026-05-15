"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useGetMyWorkspaces } from "@/features/auth/api/use-get-my-workspaces";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransferWorkspaceModal } from "@/features/workspaces/hooks/use-transfer-workspace-modal";
import { useLeaveWorkspace } from "@/features/workspaces/api/use-leave-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import MobileBackButton from "@/components/mobile-back-button";

const WorkspacesClient = () => {
  const { data, isPending } = useGetMyWorkspaces();
  const { open } = useTransferWorkspaceModal();
  const { mutate } = useLeaveWorkspace();

  const workspaces = data?.workspaces;

  const [ConfirmDialog, confirm] = useConfirm(
    "Leave Workspace",
    "This action is irreversible. You will lose access of this workspace.",
    "destructive",
  );

  const handleLeave = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    mutate({
      param: {
        workspaceId: id,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <ConfirmDialog />

      <PageHeader
        header={"Workspaces"}
        subText="Manage your personal information, security, and workspace memberships."
        button={false}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">Workspaces</h2>
      </div>
      <div className="p-3 w-full bg-neutral-100">
        <MobileBackButton />
        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto">
          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Your workspaces
                </CardTitle>
                <p className="text-xs">All workspaces you belong to.</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPending ? (
                <SkeletonComponent />
              ) : workspaces?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <p className="text-sm text-muted-foreground">
                    You are not a member of any workspaces.
                  </p>
                </div>
              ) : (
                workspaces?.map((ws) => (
                  <div
                    className="bg-white p-3 flex flex-col items-center justify-center w-full border rounded-md"
                    key={ws.id}
                  >
                    <div className="flex items-center gap-4 px-3 w-full">
                      <ProjectAvatar
                        name={ws.name}
                        image=""
                        className="size-12"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{ws.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {/* @ts-ignore */}
                          Joined {format(new Date(ws.joinedAt), "PP")}
                        </p>
                      </div>
                      {ws.isOwner ? (
                        <Badge variant="ACTIVE" className="capitalize">
                          Owner
                        </Badge>
                      ) : (
                        <Badge variant="ACTIVE" className="capitalize">
                          {ws.role}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 w-full">
                      {ws.isOwner ? (
                        <Button
                          variant={"destructive"}
                          className="text-sm"
                          onClick={() => open(ws.id)}
                        >
                          Transfer ownership
                        </Button>
                      ) : (
                        <Button
                          variant={"destructive"}
                          onClick={() => handleLeave(ws.id)}
                        >
                          Leave
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SkeletonComponent = () => {
  return [1, 2, 3].map((s) => (
    <div
      className="bg-white p-3 flex flex-col items-center justify-center w-full border rounded-md"
      key={s}
    >
      <div className="flex items-center gap-4 px-3 w-full">
        <Skeleton className="size-12" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
      <div className="flex flex-col items-end gap-1 w-full">
        <Skeleton className="w-20 h-7" />
      </div>
    </div>
  ));
};
export default WorkspacesClient;
