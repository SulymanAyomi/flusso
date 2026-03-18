"use client";
import PageHeader from "@/components/page-header";
import { AuthUser } from "@/features/auth/type";
import InviteCard from "@/features/members/components/invite-card";
import { MembersList } from "@/features/members/components/members-list";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { HomeIcon, ChevronRightIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MembersClientPageProps {
  user: AuthUser;
}
const MembersClientPage = ({ user }: MembersClientPageProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="w-full">
      <PageHeader
        header={`Welcome, ${user.name}`}
        subText={"Start to manage your workspace members."}
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
        <Link href={`/workspaces/${workspaceId}/members`}>
          <div className="flex items-center text-blue-700 text-xs">
            <span className="mr-1">
              <Users2Icon className="size-3" />
            </span>
            Members
          </div>
        </Link>
      </div>
      <div className="flex font-semibold items-start px-3 py-2">
        <h2 className="text-lg md:text-xl font-semibold">Workspace members</h2>
      </div>
      <div className="px-3 w-full">
        <MembersList />
      </div>
    </div>
  );
};

export default MembersClientPage;
