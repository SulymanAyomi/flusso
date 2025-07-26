import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/siderbar";
import { getCurrent } from "@/features/auth/query";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { EditProjectModal } from "@/features/projects/components/edit-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { TaskDetailsModal } from "@/features/tasks/components/task-details-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const user = await getCurrent();
  console.log("frontend", user);
  if (!user) redirect("/sign-in");
  return (
    <div className="min-h-screen">
      <CreateTaskModal />
      <TaskDetailsModal />
      <EditTaskModal />
      <CreateProjectModal />
      <EditProjectModal />
      <CreateWorkspaceModal />
      <div className="flex w-full h-full">
        <div className="fixed left-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar user={user} />
            <main className="h-full flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
