"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { MemberProfileWrapper } from "./member-profile-wrapper";
import { useMemberProfileModal } from "../../hook/use-member-profile";

export const MemberProfileModal = () => {
  const { memberId, close } = useMemberProfileModal();

  return (
    <ResponsiveModal open={!!memberId} onOpenChange={close}>
      {memberId && <MemberProfileWrapper id={memberId} onCancel={close} />}
    </ResponsiveModal>
  );
};
