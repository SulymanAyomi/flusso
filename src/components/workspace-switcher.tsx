"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { WorkspaceType } from "@/features/workspaces/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { Button } from "./ui/button";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { isLoading, data: workspaces } = useGetWorkspaces();
  const [selected, setSelected] = useState<WorkspaceType>();

  const onSelect = (workspace: WorkspaceType) => {
    setSelected(workspace);
    router.push(`/workspaces/${workspace.id}`);
  };

  useEffect(() => {
    if (workspaceId) {
      setSelected(() => {
        return workspaces?.find((workspace) => workspace.id == workspaceId);
      });
    }
  }, [workspaces]);

  // if (workspaces && workspaces.length > 0) {
  //   const d = workspaces.find((workspace) => workspace.id == workspaceId);
  //   setSelected(d);
  // }
  if (isLoading) {
    return (
      <div className="bg-[#EBF2FF] text-black border-[#EBF2FF] p-3 rounded-md">
        <div className="flex items-center gap-4">
          <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Skeleton className="size-full rounded-full" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <Skeleton className="h-2 w-[140px]" />
            <Skeleton className="h-2 w-[140px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 border border-[#EBF2FF] rounded-[12px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="bg-[#EBF2FF] focus-visible:border-[#EBF2FF] focus-visible:ring-0 transition text-black data-[state=open]:bg-brand1 border-[#EBF2FF] data-[state=open]:text-[#1546e7]  hover:bg-[#EBF2FF/90] px-3 py-6"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <p className="font-medium">{selected?.name}</p>
              {/* <p className="text-xs">Amin</p> */}
            </div>
            <ChevronsUpDown className="ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width]"
          align="start"
        >
          {workspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onSelect={() => onSelect(workspace)}
            >
              {workspace.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
