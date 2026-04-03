"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { AssignProjectMemberWrapper } from "./assign-project-wrapper";
import { useAssignProjectMemberModal } from "../../hooks/use-assign-member";

export const AssignProjectMemberModal = () => {
  const { memberId, close } = useAssignProjectMemberModal();

  return (
    <ResponsiveModal open={!!memberId} onOpenChange={close}>
      {memberId && (
        <AssignProjectMemberWrapper id={memberId} onCancel={close} />
      )}
    </ResponsiveModal>
  );
};
