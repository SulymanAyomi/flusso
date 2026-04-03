"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useGetMemberProjectsType } from "@/features/members/types";
import { QuickProjectsType } from "../../types";
import { useAssignProjectMember } from "../../api/use-aasign-project-member";
import { useAssignMemberToProjects } from "@/features/members/api/use-assign-project-member";

interface AssignProjectMemberProps {
  onCancel?: () => void;
  member: useGetMemberProjectsType;
  projects: QuickProjectsType;
}

export const AssignProjectMember = ({
  onCancel,
  member,
  projects,
}: AssignProjectMemberProps) => {
  const name = member.user.name;
  const allProjects = projects?.map((p) => p.id);
  const joinedProjects = member.projectMembers.map((m) => m.projectId);
  const [selectedProjects, setSelectedProjects] =
    useState<string[]>(joinedProjects);
  const toggleTask = (id: string) => {
    setSelectedProjects((prev) => {
      return prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
    });
  };
  const { mutate, isPending, error } = useAssignMemberToProjects();
  const onSubmit = () => {
    mutate(
      {
        json: { projectsId: selectedProjects },
        param: { memberId: member.id },
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
          <p className="text-xl font-bold">Assign to project</p>
        </div>
      </div>
      <div className="mt-3 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-0">
        <div className="bg-white p-1 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
          <div className="flex  gap-1 flex-col items-start justify-between gap-x-2">
            <p className="text-xs">Assign {name} to project</p>
          </div>
          {/* <DottedSeparator /> */}
          <div className="border rounded-md min-h-4">
            <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
              {projects?.map((project, index) => (
                <div
                  key={index}
                  className="flex gap-2  p-3 items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full"
                >
                  <label
                    key={project.id}
                    className="flex items-center cursor-pointer gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                    onClick={() => toggleTask(project.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()} // Prevent label click from triggering twice
                    />
                    <span>{project.name}</span>
                  </label>
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
