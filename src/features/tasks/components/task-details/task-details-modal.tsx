"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { useTaskDetailsModal } from "../../hooks/use-task-details-modal";
import { TaskDetailWrapper } from "./task-details-wrapper";

export const TaskDetailsModal = () => {
  const { taskDetailId, close } = useTaskDetailsModal();

  return (
    <ResponsiveModal open={!!taskDetailId} onOpenChange={close}>
      {taskDetailId && <TaskDetailWrapper id={taskDetailId} onCancel={close} />}
    </ResponsiveModal>
  );
};
