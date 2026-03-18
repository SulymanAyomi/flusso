import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import React from "react";

import { MemberRole } from "../types";
import { Button } from "@/components/ui/button";
interface MemberActionProps {
  userRole: MemberRole;
  memberRole: MemberRole;
  memberId: string;
  isUpdatingMember: boolean;
  handleUpdateMember: (id: string, role: MemberRole) => void;
  handleDeleteMember: (id: string) => void;
  isDeletingMember: boolean;
}

const MemberAction = ({
  userRole,
  memberRole,
  memberId,
  isUpdatingMember,
  handleUpdateMember,
  handleDeleteMember,
  isDeletingMember,
}: MemberActionProps) => {
  const isOwner = userRole === MemberRole.OWNER;
  const isAdmin = userRole === MemberRole.ADMIN;

  const isTargetOwner = memberRole === MemberRole.OWNER;
  const isTargetAdmin = memberRole === MemberRole.ADMIN;

  const canManageRoles =
    isOwner || (isAdmin && memberRole === MemberRole.MEMBER);

  const canRemove = isOwner
    ? !isTargetOwner
    : isAdmin && memberRole === MemberRole.MEMBER;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="ml-auto border-none" variant="secondary" size="icon">
          <MoreVerticalIcon className="size-4 text-muted-foreground " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {canManageRoles && (
          <DropdownMenuItem
            onClick={() =>
              handleUpdateMember(
                memberId,
                isTargetAdmin ? MemberRole.MEMBER : MemberRole.ADMIN,
              )
            }
            disabled={isUpdatingMember}
          >
            {isTargetAdmin ? "Set as Member" : "Set as Administrator"}
          </DropdownMenuItem>
        )}
        {canRemove && (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => handleDeleteMember(memberId)}
            disabled={isDeletingMember}
          >
            Remove member
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberAction;
