"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { EditProjectFormWrapper } from "./edit-project-form-wrapper";
import { useEditProjectModal } from "../hooks/use-edit-project-modal";

export const EditProjectModal = () => {
  const { projectId, close } = useEditProjectModal();

  return (
    <ResponsiveModal open={!!projectId} onOpenChange={close}>
      {projectId && <EditProjectFormWrapper id={projectId} onCancel={close} />}
    </ResponsiveModal>
  );
};
