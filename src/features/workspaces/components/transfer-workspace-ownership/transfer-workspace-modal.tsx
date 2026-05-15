"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useTransferWorkspaceModal } from "../../hooks/use-transfer-workspace-modal";
import { TransferWorkspaceWrapper } from "./transfer-workspace-wrapper";

export const TransferWorkspaceModal = () => {
  const { workspaceId, close } = useTransferWorkspaceModal();

  return (
    <ResponsiveModal open={!!workspaceId} onOpenChange={close}>
      {workspaceId && (
        <TransferWorkspaceWrapper id={workspaceId} onCancel={close} />
      )}
    </ResponsiveModal>
  );
};
