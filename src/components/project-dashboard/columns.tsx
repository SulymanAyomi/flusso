"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskDate } from "@/features/tasks/components/task-date";
import { ProjectActions } from "./project-action";
import { AllProjectsResponseType } from "@/features/projects/api/use-get-projects";
import { Progress } from "../ui/progress";
import Link from "next/link";

type ProjectType = AllProjectsResponseType["data"][0];

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl ?? ""}
          />
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.id}`}
          >
            <p className="line-clamp-1">{project.name}</p>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const percentage = row.original.percentage;
      return (
        <div className="flex gap-2 items-center">
          <Progress
            value={percentage}
            color="blue"
            className="bg-neutral-400 text-blue-500"
          ></Progress>
          <p>{percentage.toFixed(0)}%</p>
        </div>
      );
    },
  },
  {
    accessorKey: "tasks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tasks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = row.original.counts.total;
      const completed = row.original.counts.completed;
      return (
        <p className="text-center">
          {completed}/{total}
        </p>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.endDate!;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <ProjectActions id={id}>
          <Button variant="ghost">
            <MoreVertical className="size-4" />
          </Button>
        </ProjectActions>
      );
    },
  },
];
