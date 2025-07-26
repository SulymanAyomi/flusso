"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Archive,
  ArrowUp,
  Check,
  CheckIcon,
  ChevronRightIcon,
  FilterIcon,
  FlagIcon,
  Folder,
  Layout,
  LayoutGridIcon,
  LayoutIcon,
  LayoutList,
  MenuIcon,
  MoreVerticalIcon,
  Plus,
  SearchIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import ProjectsAnalytics from "@/components/projects-analytics";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import ProjectCard from "@/components/project-dashboard/project-card";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import PageHeader from "@/components/page-header";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

function ProjectsClientPage() {
  const workspaceId = useWorkspaceId();
  const [view, setView] = useState("table");
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <PageHeader
        header={"Welcome, Ayomi"}
        subText={"Start to manage your projects and assigned tasks here"}
        button={true}
        buttonType={"project"}
      />
      <div className="flex gap-1 text-xs px-3 py-1">
        <Link href={`/workspaces/${workspaceId}`}>
          <div className="flex items-center text-neutral-500 text-xs">
            <span className="mr-1">
              <Folder className="size-3" />
            </span>
            Dashboard
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <Link href={`/workspaces/${workspaceId}/projects`}>
          <span className="text-xs text-blue-700">Project</span>
        </Link>
      </div>
      <Tabs
        defaultValue={view}
        onValueChange={setView}
        className="flex-1 w-full"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <div className="flex items-center">
            <div className="flex font-semibold items-start mr-1">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              {/* <div className="text-[8px] text-blue-700">{projects?.length}</div> */}
            </div>
            <div className="flex bg-white border rounded-3xl p-0.5">
              <TabsList className="p-0 h-fit gap-1">
                <TabsTrigger
                  value="table"
                  className="px-2 py-1 rounded-2xl cursor-pointer bg-inherit text-black data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <div>
                    <LayoutIcon className="size-4" />
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="grid"
                  className="px-2 py-1 rounded-2xl cursor-pointer bg-inherit text-black data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <div>
                    <LayoutGridIcon className="size-4" />
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="border rounded-xl flex items-center gap-1 text-gray-600 text-xs p-2">
              <Archive className="size-4" />
              <span>Archived</span>
            </div>
            <div
              className={cn(
                "cursor-pointer border rounded-xl flex items-center gap-1 text-gray-600 text-xs p-2",
                showFilter && "text-white bg-blue-700"
              )}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterIcon className="size-4" />
              <span>Show Filters</span>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute pl-1 text-neutral-500 top-1/2 transform -translate-y-1/2 ">
                  <SearchIcon className="size-4" />
                </div>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="pl-7 focus-visible:ring-blue-500 focus-visible:border-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-3 w-full bg-neutral-100">
          {/* small top cards */}

          <ProjectsAnalytics />

          {/* dashboards cards */}

          <ProjectCard view={view} showFilter={showFilter} search={search} />
        </div>
      </Tabs>
    </div>
  );
}

export default ProjectsClientPage;
