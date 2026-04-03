"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useGetAllWorkspaceMemberType } from "@/features/members/types";
import { SingleProjectType } from "../../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Badge } from "@/components/ui/badge";
import { useAssignMembers } from "@/features/members/api/use-assign-member";

interface AssignMemberProps {
  onCancel?: () => void;
  project: SingleProjectType;
  members: useGetAllWorkspaceMemberType;
}

export const AssignMember = ({
  onCancel,
  members,
  project,
}: AssignMemberProps) => {
  const name = project.name;
  const ownerId = members.workspace.ownerId;
  const allMembers = members.populateMembers.filter((m) => m.id != ownerId);
  const joinedMember = project.projectMembers.map((m) => m.memberId);
  const [selectedMembers, setSelectedMembers] =
    useState<string[]>(joinedMember);
  const toggleTask = (id: string) => {
    setSelectedMembers((prev) => {
      return prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
    });
  };
  const { mutate, isPending, error } = useAssignMembers();
  const onSubmit = () => {
    mutate(
      {
        json: { memberId: selectedMembers },
        param: { projectId: project.id },
      },
      {
        onSuccess: () => {
          onCancel?.();
        },
        onError(error) {
          console.log("i am error", error);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full p-2.5 px-3 border-none shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <p className="text-xl font-bold">Assign members to project</p>
        </div>
      </div>
      <div className="mt-3 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-0">
        <div className="bg-white p-1 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
          <div className="flex  gap-1 flex-col items-start justify-between gap-x-2">
            <p className="text-xs">Assign members to {name}</p>
          </div>
          {/* <DottedSeparator /> */}
          <div className="border rounded-md min-h-4 bg-neutral-200 p-2">
            <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
              {allMembers?.map((member, index) => (
                <div
                  onClick={() => toggleTask(member.id)}
                  key={index}
                  className="flex gap-2 p-3 items-center cursor-pointer justify-start py-2 rounded-md hover:bg-primary-foreground w-full bg-white"
                >
                  <label
                    key={member.id}
                    className="flex items-center cursor-pointer gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()} // Prevent label click from triggering twice
                    />
                  </label>
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
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancle
            </Button>
            <Button
              disabled={isPending}
              variant="primary"
              onClick={() => onSubmit()}
            >
              {isPending ? (
                <>
                  <span>
                    <Loader2Icon className="animate-spin h-full" />
                  </span>
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
