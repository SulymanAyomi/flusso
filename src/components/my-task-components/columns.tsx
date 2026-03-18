"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditTask } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "@/features/tasks/components/task-date";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskActions } from "@/features/tasks/components/task-actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const columns: ColumnDef<EditTask>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="line-clamp-1">{name}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p> {name}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "projects",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      const img = project.imageUrl ?? undefined;
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <ProjectAvatar className="size-6" name={project.name} image={img} />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-1">{project.name}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p> {project.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignedTo?.user;
      if (assignee) {
        return (
          <div className="flex items-center gap-x-2 font-medium">
            <MemberAvatar
              className="size-6"
              fallbackClassName="text-xs"
              name={assignee.name!}
            />
            <p className="line-clamp-1">{assignee.name}</p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "dueDate",
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
      const dueDate = row.original.dueDate!;
      return <TaskDate value={dueDate} />;
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
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.original.priority;
      return <Badge variant={priority}>{snakeCaseToTitleCase(priority)}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const projectId = row.original.projectId;
      return (
        <TaskActions id={id}>
          <Button variant="ghost">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
