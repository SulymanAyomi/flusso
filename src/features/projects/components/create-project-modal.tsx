"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import CreateProject from "./create-project";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProject onCancel={close} />
    </ResponsiveModal>
  );
};
