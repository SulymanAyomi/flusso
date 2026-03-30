"use client";
import PageHeader from "@/components/page-header";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { HomeIcon, ChevronRightIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SettingsClientPage = () => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="w-full">
      <PageHeader
        header={`Settings`}
        subText={"Customize your workspace, preferences and integrations."}
        button={true}
        buttonType={"project"}
      />
      <div className="flex gap-1 text-xs px-3 py-1">
        <Link href={`/workspaces/${workspaceId}`}>
          <div className="flex items-center text-neutral-500 text-xs">
            <span className="mr-1">
              <HomeIcon className="size-3" />
            </span>
            Dashboard
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <Link href={`/workspaces/${workspaceId}/settings`}>
          <div className="flex items-center text-blue-700 text-xs">
            <span className="mr-1">
              <SettingsIcon className="size-3" />
            </span>
            Settings
          </div>
        </Link>
      </div>
      <div className="flex font-semibold items-start px-3 py-2">
        <h2 className="text-lg md:text-xl font-semibold">Workspace settings</h2>
      </div>
      <div className="w-full bg-neutral-100">
        <EditWorkspaceForm />
      </div>
    </div>
  );
};

export default SettingsClientPage;
