"use client";
import { useState } from "react";
import Image from "next/image";
import { differenceInDays, format } from "date-fns";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/tasks-view/task-view-switcher";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  Folder,
  HomeIcon,
  Loader,
  PencilLineIcon,
  PlusCircle,
  TagIcon,
  UserCheck2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import PageHeader from "@/components/page-header";
import { useEditProjectModal } from "@/features/projects/hooks/use-edit-project-modal";
import Link from "next/link";
import { snakeCaseToTitleCase } from "@/lib/utils";

export const ProjectIdClient = () => {
  const [remainingDays, setRemainingDays] = useState("");
  const today = new Date();
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ workspaceId });
  const { open } = useEditProjectModal();
  const isLoading = isLoadingProject || isLoadingAnalytics;
  const tagslist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return (
      <PageError
        title="Project not found."
        message="This project may have been deleted or you might not have access to it."
        primaryAction={{
          label: "View projects",
          href: `/workspaces/${workspaceId}/projects`,
        }}
        secondaryAction={{
          label: "Back to workspace",
          href: `/workspaces/${workspaceId}`,
        }}
      />
    );
  }
  // if (project.endDate) {
  //   const today = new Date();
  //   const days = differenceInDays(project.endDate!, today);
  //   setRemainingDays(`${days} day(s) more`);
  // }
  const openEdit = () => open(project.id);

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
              <HomeIcon className="size-3" />
            </span>
            Dashboard
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <Link href={`/workspaces/${workspaceId}/projects`}>
          <div className="flex items-center text-neutral-500 text-xs">
            <span className="mr-1">
              <Folder className="size-3" />
            </span>
            Projects
          </div>
        </Link>
        <div className="text-neutral-500">
          <ChevronRightIcon className="size-4" />
        </div>
        <div className="text-xs text-blue-700">Project</div>
      </div>
      <div className="px-3 my-2 w-full bg-white">
        <div className="flex items-baseline justify-start">
          <p className="text-2xl font-semibold line-clamp-1">{project.name}</p>
          <span className="ml-4 cursor-pointer" onClick={openEdit}>
            <PencilLineIcon className="size-4 text-neutral-500" />
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[25%] lg:w-[12%] items-center justify-start">
              <Loader className="size-4 mr-2" />
              <p>Status</p>
            </div>
            <div className="flex">
              <Badge variant={project.status}>
                {snakeCaseToTitleCase(project.status)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[25%] lg:w-[12%] items-center justify-start">
              <UserCheck2Icon className="size-4 mr-2" />
              <p>Assignees</p>
            </div>
            <TeamMembers teams={project.team} />
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex text-sm w-[25%] lg:w-[12%] items-center justify-start">
              <CalendarDaysIcon className="size-4 mr-2" />
              <p>Due Date</p>
            </div>
            <div className="flex  gap-1">
              <div className="text-black px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs">
                <p>
                  {format(new Date(project.startDate!), "MMM d, yyyy")} -{" "}
                  {format(new Date(project.endDate!), "MMM d, yyyy")} (
                  {differenceInDays(new Date(project.endDate!), today)} day(s)
                  more)
                </p>
              </div>
            </div>
          </div>
          <div className="flex  items-center justify-start">
            <div className="flex text-sm w-[25%] lg:w-[12%] items-center justify-start">
              <TagIcon className="size-4 mr-2" />
              <p>Tags</p>
            </div>
            <div className="flex  gap-1">
              {/* <ProjectTags tags={project.tag} /> */}
              <div className="py-1 text-xs font-semibold ml-2 cursor-pointer">
                Add more...
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col md:flex-row  justify-start">
            <div className="flex text-sm w-[25%] lg:w-[12%] items-center justify-start">
              <TagIcon className="size-4 mr-2" />
              <p>Description</p>
            </div>
            <div className="bg-blue-100 md:bg-inherit p-2 md:p-0 rounded-md w-full min-h-14 md:min-h-0 mt-2 md:mt-0 md:ml-[45px]">
              <div className="text-sm">
                <p>{project.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <TaskViewSwitcher hideProjectFilter={true} />
      </div>
    </div>
  );
};

interface TeamMembersProps {
  teams: {
    id: string;
    user: {
      name: string | null;
      imageUrl: string | null;
    };
  }[];
}
const TeamMembers = ({ teams }: TeamMembersProps) => (
  <div className="flex gap-1 flex-wrap">
    {teams.map((team) =>
      team.id ? (
        <div
          className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold"
          key={team.id}
        >
          <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5 mr-1">
            {team.user.imageUrl ? (
              <Image src={team.user.imageUrl} alt={team.user.name![0]} />
            ) : (
              team.user.name![0].toUpperCase()
            )}
          </div>
          <p>{team.user.name}</p>
        </div>
      ) : (
        <></>
      ),
    )}
    {/* <div className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Baba Tunde</p>
    </div>
    <div className="bg-sky-100 text-sky-800 px-1 pr-1.5 py-1 flex items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Tolu James</p>
    </div>
    <div className="bg-sky-100 px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        A
      </div>
      <p>Musa Ridwan</p>
    </div> */}
    <div className="cursor-pointer bg-sky-100 px-1 pr-1.5 py-1 flex gap-1 items-center justify-center rounded-xl text-xs font-semibold">
      <div className="flex items-center justify-center rounded-full bg-red-50 p-1 size-5">
        <PlusCircle />
      </div>
      <p>Assign task</p>
    </div>
  </div>
);
