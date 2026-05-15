"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useChangeEmailModal } from "../../hook/use-change-email";
import ChangeEmailWrapper from "./change-email-wrapper";

export const ChangeEmailModal = () => {
  const { isOpen, close } = useChangeEmailModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={close}>
      {isOpen && <ChangeEmailWrapper />}
    </ResponsiveModal>
  );
};
