"use client";
import { ArrowLeftIcon, Loader2Icon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "../api/use-get-members";
import { MemberAvatar } from "./member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMembers } from "../api/use-delete-members";
import { useUpdateMembers } from "../api/use-update-members";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import InviteCard from "./invite-card";
import MemberAction from "./member-action";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetMembers({ workspaceId });
  const [ConfirmDelete, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive",
  );

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMembers();

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMembers();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-190px)] flex items-center justify-center">
        <Loader2Icon className="size-9 animate-spin text-blue-400" />
      </div>
    );
  }
  if (!data) {
    return (
      <PageError
        title="Something went wrong"
        message="We ran into unexpected issue. Your data is safe."
        primaryAction={{
          label: "Go to dashboard",
          href: `/workspaces/${workspaceId}`,
        }}
      />
    );
  }
  const workspace = data.workspace;
  const user = data.user!;
  const owner = data.populateMembers.find((m) => m.role == "ADMIN");
  const members = data.populateMembers.filter((m) => m.role == "MEMBER");
  // const viwers

  return (
    <div>
      <Card className="w-full h-full border-none shadow-none ">
        <ConfirmDelete />

        <CardContent className="flex flex-col justify-center">
          <div className="bg-white p-3 flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">Owner</h3>
            <div className="flex items-center gap-4  p-3 border rounded-md">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={owner?.user.name!}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{owner?.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {owner?.user.email}
                </p>
              </div>
              <Badge variant="CRITICAL">Owner</Badge>
              <MemberAction
                userRole={user.role}
                memberRole={owner?.role!}
                memberId={owner?.id!}
                handleDeleteMember={handleDeleteMember}
                handleUpdateMember={handleUpdateMember}
                isDeletingMember={isDeletingMember}
                isUpdatingMember={isUpdatingMember}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
            {data?.populateMembers.map((member, index) => (
              <Fragment key={member.id}>
                <div className="bg-white p-3 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-4  p-3 border rounded-md">
                    <MemberAvatar
                      className="size-10"
                      fallbackClassName="text-lg"
                      name={member.user.name!}
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                    <Badge variant="ACTIVE" className="capitalize">
                      {member.role.toLowerCase()}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          className="ml-auto border-none"
                          variant="secondary"
                          size="icon"
                        >
                          <MoreVerticalIcon className="size-4 text-muted-foreground " />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem
                          className="font-medium"
                          onClick={() =>
                            handleUpdateMember(member.id, MemberRole.ADMIN)
                          }
                          disabled={isUpdatingMember}
                        >
                          Set as Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-medium"
                          onClick={() =>
                            handleUpdateMember(member.id, MemberRole.MEMBER)
                          }
                          disabled={isUpdatingMember}
                        >
                          Set as Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-medium text-amber-700"
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={isDeletingMember}
                        >
                          Remove {member.user.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="w-full lg:max-w-xl mx-auto border rounded-md">
        <InviteCard workspace={workspace} />
      </div>
    </div>
  );
};
