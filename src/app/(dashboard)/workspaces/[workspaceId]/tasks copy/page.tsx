import { getCurrent } from "@/features/auth/query";
import { TaskViewSwitcher } from "@/features/tasks/components/tasks-view/task-view-switcher";
import { redirect } from "next/navigation";

const TaskPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TaskPage;
