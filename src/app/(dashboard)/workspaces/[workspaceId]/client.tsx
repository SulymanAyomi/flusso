"use client";

import Analytics from "@/components/workspace-dashboard/analytics";

import ProjectLists from "@/components/workspace-dashboard/projects-list";
import HighPiority from "@/components/workspace-dashboard/high-piority";
import Activities from "@/components/workspace-dashboard/activities";
import TaskTabs from "@/components/workspace-dashboard/task-tab";
import PageHeader from "@/components/page-header";
import { AuthUser } from "@/features/auth/type";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import PerformanceDashboard from "@/components/workspace-dashboard/demo";

interface WorkspaceIdClientProps {
  user: AuthUser;
}

export const WorkspaceIdClient = ({ user }: WorkspaceIdClientProps) => {
  const name = user.name;
  const workspaceId = useWorkspaceId();
  const { isLoading, data: workspaces } = useGetWorkspace({
    workspaceId,
  });
  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaces) {
    return (
      <PageError
        title="Workspace not found."
        message="This workspace may have been deleted, moved or you might not have access to it."
        primaryAction={{
          label: "View workspaces",
          href: `/workspaces/${workspaceId}`,
        }}
      />
    );
  }
  return (
    <div className="flex flex-col">
      <PageHeader
        header={`Welcome, ${name}`}
        subText="Here's an overview of your workspace, projects, and recent activity."
        button={true}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">Dashboard</h2>
      </div>
      {/* Body */}
      <div className="px-3 w-full bg-neutral-100">
        {/* workspce overview cards */}
        <Analytics />
        {/* workspace dashboards cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 py-2 gap-2">
          {/* projects card  */}
          <ProjectLists />

          {/* highest tasks piority card */}
          <HighPiority />

          {/* my Tasks card */}
          <TaskTabs />

          {/* Activity card */}
          <Activities />
          {/* Ai card */}
        </div>
      </div>
    </div>
  );
};
