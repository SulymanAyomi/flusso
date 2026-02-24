"use client";

import Analytics from "@/components/workspace-dashboard/analytics";

import ProjectLists from "@/components/workspace-dashboard/projects-list";
import HighPiority from "@/components/workspace-dashboard/high-piority";
import Activities from "@/components/workspace-dashboard/activities";
import TaskTabs from "@/components/workspace-dashboard/task-tab";
import PageHeader from "@/components/page-header";
import { AuthUser } from "@/features/auth/type";

interface WorkspaceIdClientProps {
  user: AuthUser;
}

export const WorkspaceIdClient = ({ user }: WorkspaceIdClientProps) => {
  const name = user.name;
  return (
    <div className="flex flex-col">
      <PageHeader
        header={`Welcome, ${name}`}
        subText="Start to manage your workspaces and their projects here"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 py-2 gap-2">
          {/* workspace dashboards cards */}
          {/* projects card  */}
          <ProjectLists />
          <div className="flex gap-2 flex-col">
            {/* highest piority card */}
            <HighPiority />
            {/* Activity card */}
            <Activities />
          </div>
          {/* Tasks card */}
          <TaskTabs />
          {/* Ai card */}
        </div>
      </div>
    </div>
  );
};
