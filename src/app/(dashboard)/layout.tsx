import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/siderbar";
import AuthProvider from "@/components/AuthProvider";
import { getCurrent } from "@/features/auth/query";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { EditProjectModal } from "@/features/projects/components/edit-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-form/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-form/edit-task-modal";
import { TaskDependenciesModal } from "@/features/tasks/components/task-dependencies/edit-dependencies-modal";
import { TaskDetailsModal } from "@/features/tasks/components/task-details/task-details-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen">
      <AuthProvider>
        <CreateTaskModal />
        <TaskDependenciesModal />
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
              <Navbar />
              <main className="h-full flex flex-col">
                <TooltipProvider>{children}</TooltipProvider>
              </main>
            </div>
          </div>
        </div>
      </AuthProvider>
    </div>
  );
};
export default DashboardLayout;
