"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { useTaskDependenciesModal } from "../../hooks/use-task-dependencies";
import { TaskDependenciesWrapper } from "./edit-dependencies-wrapper";

export const TaskDependenciesModal = () => {
  const { taskId, close } = useTaskDependenciesModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <TaskDependenciesWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
