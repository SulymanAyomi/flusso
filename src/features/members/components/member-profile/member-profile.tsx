"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  useGetAllWorkspaceMemberType,
  useGetMemberType,
} from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Badge } from "@/components/ui/badge";
import { useAssignMembers } from "@/features/members/api/use-assign-member";
import { format } from "date-fns";
import { stat } from "fs";

interface MemberProfileProps {
  onCancel?: () => void;
  data: useGetMemberType;
}

export const MemberProfile = ({ onCancel, data }: MemberProfileProps) => {
  const member = data.member;
  const stats = data.stats;
  const projects = data.projects;
  return (
    <Card className="w-full h-full p-2.5 px-3 border-none shadow-none">
      <CardContent className="p-0">
        <div className="bg-white pt-3 p-1 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
          <div className="flex gap-2 p-3 items-center cursor-pointer justify-start py-2 rounded-md hover:bg-primary-foreground w-full bg-white">
            <MemberAvatar
              className="size-10"
              fallbackClassName="text-lg"
              name={member.user.name!}
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{member.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {member.user.email}
              </p>
            </div>
            <Badge variant={member.role} className="capitalize">
              {member.role.toLowerCase()}
            </Badge>
          </div>
          <div className="p-3 text-neutral-600 space-y-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm">
                <p>Joined date</p>
              </div>
              <div className="">
                <p className="text-black">
                  {format(new Date(member.joinedAt!), "MMMM d, yyyy")}{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm">
                <p>Tasks assigned</p>
              </div>
              <div className="">
                <p className="text-black">{stats.taskAssigned}</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm">
                <p>Tasks completed</p>
              </div>
              <div className="">
                <p className="text-black">{stats.tasksCompleted}</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm">
                <p>Tasks overdue</p>
              </div>
              <div className="">
                <p className="text-black">{stats.taskOverdue}</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm">
                <p>Projects joined</p>
              </div>
              <div className="">
                <p className="text-black">{projects.length}</p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center">
                <p className="text-black">Projects</p>
              </div>
              <div className="space-y-2">
                {projects.map((p) => (
                  <p key={p.id}>{p.name}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
