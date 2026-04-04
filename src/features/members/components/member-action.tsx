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
import { useAssignProjectMemberModal } from "@/features/projects/hooks/use-assign-member";
import { useMemberProfileModal } from "../hook/use-member-profile";
type role = "ADMIN" | "MEMBER" | "VIEWER";
interface MemberActionProps {
  userRole: role;
  memberRole: role;
  memberId: string;
  userId: string;
  ownerId: string;
  isUpdatingMember: boolean;
  handleUpdateMember: (id: string, role: MemberRole) => void;
  handleDeleteMember: (id: string) => void;
  isDeletingMember: boolean;
}

const MemberAction = ({
  userId,
  ownerId,
  userRole,
  memberRole,
  memberId,
  isUpdatingMember,
  handleUpdateMember,
  handleDeleteMember,
  isDeletingMember,
}: MemberActionProps) => {
  const isOwner = ownerId == userId;
  const isAdmin = userRole === MemberRole.ADMIN;

  const isTargetOwner = ownerId == memberId;
  const isTargetAdmin = memberRole === MemberRole.ADMIN;

  const canManageRoles =
    isOwner || (isAdmin && memberRole === MemberRole.MEMBER);

  const { open } = useAssignProjectMemberModal();
  const { open: openProfile } = useMemberProfileModal();

  // const canRemove = isOwner
  //   ? !isTargetOwner
  //   : isAdmin && memberRole === MemberRole.MEMBER;
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
        <DropdownMenuItem
          onClick={() => openProfile(memberId)}
          disabled={isDeletingMember}
        >
          view profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open(memberId)}
          disabled={isDeletingMember}
        >
          Assign to project
        </DropdownMenuItem>
        {
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => handleDeleteMember(memberId)}
            disabled={isDeletingMember}
          >
            Remove member
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberAction;
