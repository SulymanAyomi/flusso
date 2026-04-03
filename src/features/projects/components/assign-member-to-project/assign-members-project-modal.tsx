"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { AssignMemberWrapper } from "./assign-members-project-wrapper";
import { useAssignMemberModal } from "../../hooks/use-assign-member";

export const AssignMembersModal = () => {
  const { projectId, close } = useAssignMemberModal();

  return (
    <ResponsiveModal open={!!projectId} onOpenChange={close}>
      {projectId && <AssignMemberWrapper id={projectId} onCancel={close} />}
    </ResponsiveModal>
  );
};
