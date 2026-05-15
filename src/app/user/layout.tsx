import { Navbar } from "@/components/navbar";
import AuthProvider from "@/components/AuthProvider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MemberProfileModal } from "@/features/members/components/member-profile/member-profile-modal";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { ChangeEmailModal } from "@/features/auth/components/change-email/change-email-modal";
import { TransferWorkspaceModal } from "@/features/workspaces/components/transfer-workspace-ownership/transfer-workspace-modal";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

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
        <CreateProjectModal />
        <CreateWorkspaceModal />
        <MemberProfileModal />
        <ChangeEmailModal />
        <TransferWorkspaceModal />
        <div className="flex w-full h-full">
          <div className="fixed left-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
            <ProfileSidebar />
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
